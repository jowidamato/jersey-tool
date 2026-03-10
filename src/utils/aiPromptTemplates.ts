export type SportVariant =
  | "football"
  | "basketball"
  | "hockey"
  | "american-football"
  | "formula-1"
  | "baseball"
  | "rugby"
  | "handball";

const COMMON = `You are generating a jersey config JSON for my app.
Return valid JSON only. No markdown, no comments, no prose.

Input:
- team_name: "{{TEAM_NAME}}"
- context: "{{LEAGUE_OR_COUNTRY}}"
- design_brief: "{{DESIGN_BRIEF}}"
- include_player_text: {{INCLUDE_PLAYER_TEXT}}

Global output rules:
- Output exactly one JSON object.
- Use uppercase #RRGGBB for every non-empty color field.
- Any intentionally unused field must be "".
- primary and secondary must represent the two main club or shirt colors. Do not replace one of them with an accent color just to make shapes visible.
- Accent or trim colors belong in detail fields like neckCircleColor or stripeTertiaryColor, not in primary/secondary unless they are truly one of the two main kit colors.
- Include all required top-level keys:
name, sport, primary, secondary, stripesPreset, horizontalStripesPreset, customShapePreset, sideStripePreset, baseColor, leftSleeveColor, rightSleeveColor, leftSleeveDetailColor, rightSleeveDetailColor, neckCircleColor, leftNeckCircleColor, shoulderPanelColor, stripePrimaryColor, stripeSecondaryColor, stripeTertiaryColor, sleeveStripePrimaryColor, sleeveStripeSecondaryColor, sideStripePrimaryColor, sideStripeSecondaryColor, footballBackEnabled, footballBackName, footballBackNumber, footballBackFontFamily, footballBackFontWeight, footballBackTextColor, footballBackTextOutlineEnabled, footballBackTextOutlineColor, footballBackTextOutlineWidth, footballBackNameCurveAmount, footballBackNameSize, footballBackNumberSize, footballBackNameY, footballBackNumberY, state
- Include state keys:
baseColor, leftSleeveColor, rightSleeveColor, leftSleeveDetailColor, rightSleeveDetailColor, neckCircleColor, leftNeckCircleColor, shoulderPanelColor, stripePrimaryColor, stripeSecondaryColor, stripeTertiaryColor, sleeveStripePrimaryColor, sleeveStripeSecondaryColor, sideStripePrimaryColor, sideStripeSecondaryColor, footballBackEnabled, footballBackName, footballBackNumber, footballBackFontFamily, footballBackFontWeight, footballBackTextColor, footballBackTextOutlineEnabled, footballBackTextOutlineColor, footballBackTextOutlineWidth, footballBackNameCurveAmount, footballBackNameSize, footballBackNumberSize, footballBackNameY, footballBackNumberY
- Top-level color fields and state color fields must match exactly.
`;

const SPORT_RULES: Record<SportVariant, string> = {
  football: `Sport target: football
- sport must be "football".
- Default preference: keep designs simple and common. Use vertical stripes first for classic clubs unless design_brief explicitly asks otherwise.
- Allowed vertical presets: defaultVertical, defaultVerticalCenterAlt, verticalThinFull, rightThinDouble_SP, rightThinDouble_PS, rightThinSingle_S, verticalDoubleBand, verticalTripleBand, verticalDoubleCenterSplit
- Allowed horizontal presets: regularQuadStripe, regularTripleStripe, twoColorDoubleStripe, singleBand, threeColorBand
- Allowed custom presets: diagonalLeft, diagonalRight, diagonalHalfHalf1, diagonalHalfHalf2, arrow, cross, split
- sideStripePreset, sideStripePrimaryColor, sideStripeSecondaryColor, sleeveStripePrimaryColor, sleeveStripeSecondaryColor must be "".
- Exactly one of vertical/horizontal/custom OR none should be active.
- Collar defaults: use only neckCircleColor and keep leftNeckCircleColor="".
- Only set leftNeckCircleColor when design_brief explicitly requests split/asymmetric collar.
- For vertical presets, default both sleeves to baseColor unless design_brief explicitly asks for contrast sleeves.
- Prefer defaultVertical or defaultVerticalCenterAlt before detailed variants unless explicitly requested.
- Keep stripes visible by swapping layer assignment, not by changing the club palette: baseColor should usually default to primary, and stripePrimaryColor should usually use the opposite of base between primary and secondary.
- For split custom: stripePrimaryColor is right split panel, baseColor is left/background torso.
- Player text:
  - If include_player_text=true: set footballBackEnabled=true and include backside player text.
  - footballBackName, footballBackNumber should be realistic placeholders.
  - Defaults: footballBackFontFamily="Barlow Condensed", footballBackFontWeight=700, footballBackTextColor="", footballBackTextOutlineEnabled=false, footballBackTextOutlineColor="#000000", footballBackTextOutlineWidth=2, footballBackNameCurveAmount=0, footballBackNameSize=4, footballBackNumberSize=16, footballBackNameY=11, footballBackNumberY=21.
  - If include_player_text=false: footballBackEnabled=false and footballBackName/footballBackNumber="" (keep other player text defaults valid).
`,
  basketball: `Sport target: basketball
- sport must be "basketball".
- Allowed vertical presets: defaultVertical, defaultVerticalCenterAlt, verticalThinFull, rightThinDouble_SP, rightThinDouble_PS, rightThinSingle_S, verticalDoubleBand, verticalTripleBand, verticalDoubleCenterSplit
- Allowed horizontal presets: regularQuadStripe, regularTripleStripe, twoColorDoubleStripe, singleBand, threeColorBand, basketTopBand
- Allowed custom presets: diagonalLeft, diagonalRight, arrow, cross, split
- Allowed sideStripePreset: basketSideStripeToSleeve, basketSideStripeFull, or "".
- Must be "": leftSleeveColor, rightSleeveColor, leftSleeveDetailColor, rightSleeveDetailColor, sleeveStripePrimaryColor, sleeveStripeSecondaryColor, shoulderPanelColor
- Side stripe can be used alone or with vertical; avoid combining side stripe with horizontal/custom.
- Side stripe default is symmetric: use same color for left and right.
- Side stripe colors must come from team palette (primary, secondary, or baseColor). Avoid random black/white split unless design_brief explicitly requests asymmetry.
- Keep visible contrast by swapping layer assignment, not by changing the club palette: primary and secondary must stay the two main team colors, and stripe/sideStripe colors should use the opposite of base between primary and secondary.
- Collar supports full ring + optional left-half accent.
- Player text:
  - If include_player_text=true: set footballBackEnabled=true and include front player text.
  - Defaults: footballBackFontFamily="Barlow Condensed", footballBackFontWeight=700, footballBackTextColor="", footballBackTextOutlineEnabled=false, footballBackTextOutlineColor="#000000", footballBackTextOutlineWidth=2, footballBackNameCurveAmount=0, footballBackNameSize=4, footballBackNumberSize=16, footballBackNameY=13.5, footballBackNumberY=25.5.
  - If include_player_text=false: footballBackEnabled=false and footballBackName/footballBackNumber="" (keep other player text defaults valid).
`,
  hockey: `Sport target: hockey
- sport must be "hockey".
- Allowed vertical presets: defaultVertical, defaultVerticalCenterAlt, verticalThinFull, rightThinDouble_SP, rightThinDouble_PS, rightThinSingle_S, verticalDoubleBand, verticalTripleBand, verticalDoubleCenterSplit
- Allowed horizontal presets: regularQuadStripe, regularTripleStripe, twoColorDoubleStripe, singleBand, threeColorBand, hockeyTripleBottomStripe, hockeyTripleBottomStripeShade, hockeyBottomStripeShade
- Allowed custom presets: diagonalLeft, diagonalRight, diagonalHalfHalf1, arrow, cross, split, hockeyThinArrowFill
- sideStripePreset, sideStripePrimaryColor, sideStripeSecondaryColor must be "".
- leftNeckCircleColor must be "" (hockey uses full collar color only).
- Must be "": leftSleeveDetailColor, rightSleeveDetailColor, shoulderPanelColor.
- In most cases, prefer hockey-specific horizontal bottom stripe presets over generic horizontal presets.
- Default preference order for horizontal stripes: hockeyTripleBottomStripeShade, hockeyTripleBottomStripe, hockeyBottomStripeShade.
- Keep visible contrast by swapping layer assignment, not by changing the club palette: primary and secondary must stay the two main team colors, and stripe colors should use the opposite of base between primary and secondary.
- In most cases, include sleeve stripe colors as part of the hockey look (set sleeveStripePrimaryColor and sleeveStripeSecondaryColor from team palette).
- For shaded hockey presets, stripeTertiaryColor controls shade.
- Player text:
  - If include_player_text=true: set footballBackEnabled=true and include backside player text.
  - Defaults: footballBackFontFamily="Barlow Condensed", footballBackFontWeight=700, footballBackTextColor="", footballBackTextOutlineEnabled=false, footballBackTextOutlineColor="#000000", footballBackTextOutlineWidth=2, footballBackNameCurveAmount=0, footballBackNameSize=4, footballBackNumberSize=16, footballBackNameY=11, footballBackNumberY=21.
  - If include_player_text=false: footballBackEnabled=false and footballBackName/footballBackNumber="" (keep other player text defaults valid).
`,
  "american-football": `Sport target: american-football
- sport must be "american-football".
- Renderer supports only baseColor and neckCircleColor.
- Must be "": stripesPreset, horizontalStripesPreset, customShapePreset, sideStripePreset, leftNeckCircleColor, leftSleeveColor, rightSleeveColor, leftSleeveDetailColor, rightSleeveDetailColor, shoulderPanelColor, stripePrimaryColor, stripeSecondaryColor, stripeTertiaryColor, sleeveStripePrimaryColor, sleeveStripeSecondaryColor, sideStripePrimaryColor, sideStripeSecondaryColor
- Keep design team-appropriate by selecting strong baseColor and complementary neckCircleColor.
`,
  "formula-1": `Sport target: formula-1
- sport must be "formula-1".
- Renderer supports only baseColor and neckCircleColor (visor).
- Must be "": stripesPreset, horizontalStripesPreset, customShapePreset, sideStripePreset, leftNeckCircleColor, leftSleeveColor, rightSleeveColor, leftSleeveDetailColor, rightSleeveDetailColor, shoulderPanelColor, stripePrimaryColor, stripeSecondaryColor, stripeTertiaryColor, sleeveStripePrimaryColor, sleeveStripeSecondaryColor, sideStripePrimaryColor, sideStripeSecondaryColor
- Keep design team-appropriate with racing-inspired contrast between body and visor.
`,
  baseball: `Sport target: baseball
- sport must be "baseball".
- Treat baseball exactly like football for now.
- Default preference: keep designs simple and common. Use vertical stripes first for classic clubs unless design_brief explicitly asks otherwise.
- Allowed vertical presets: defaultVertical, defaultVerticalCenterAlt, verticalThinFull, rightThinDouble_SP, rightThinDouble_PS, rightThinSingle_S, verticalDoubleBand, verticalTripleBand, verticalDoubleCenterSplit
- Allowed horizontal presets: regularQuadStripe, regularTripleStripe, twoColorDoubleStripe, singleBand, threeColorBand
- Allowed custom presets: diagonalLeft, diagonalRight, diagonalHalfHalf1, diagonalHalfHalf2, arrow, cross, split
- sideStripePreset, sideStripePrimaryColor, sideStripeSecondaryColor, sleeveStripePrimaryColor, sleeveStripeSecondaryColor must be "".
- Exactly one of vertical/horizontal/custom OR none should be active.
- Collar defaults: use only neckCircleColor and keep leftNeckCircleColor="".
- Only set leftNeckCircleColor when design_brief explicitly requests split/asymmetric collar.
- Prefer defaultVertical or defaultVerticalCenterAlt before detailed variants unless explicitly requested.
- Keep stripes visible by swapping layer assignment, not by changing the club palette: baseColor should usually default to primary, and stripePrimaryColor should usually use the opposite of base between primary and secondary.
- Player text:
  - If include_player_text=true: set footballBackEnabled=true and include backside player text.
  - Defaults: footballBackFontFamily="Barlow Condensed", footballBackFontWeight=700, footballBackTextColor="", footballBackTextOutlineEnabled=false, footballBackTextOutlineColor="#000000", footballBackTextOutlineWidth=2, footballBackNameCurveAmount=0, footballBackNameSize=4, footballBackNumberSize=16, footballBackNameY=11, footballBackNumberY=21.
  - If include_player_text=false: footballBackEnabled=false and footballBackName/footballBackNumber="" (keep other player text defaults valid).
`,
  rugby: `Sport target: rugby
- sport must be "rugby".
- Treat rugby exactly like football for now.
- Default preference: keep designs simple and common. Use vertical stripes first for classic clubs unless design_brief explicitly asks otherwise.
- Allowed vertical presets: defaultVertical, defaultVerticalCenterAlt, verticalThinFull, rightThinDouble_SP, rightThinDouble_PS, rightThinSingle_S, verticalDoubleBand, verticalTripleBand, verticalDoubleCenterSplit
- Allowed horizontal presets: regularQuadStripe, regularTripleStripe, twoColorDoubleStripe, singleBand, threeColorBand
- Allowed custom presets: diagonalLeft, diagonalRight, diagonalHalfHalf1, diagonalHalfHalf2, arrow, cross, split
- sideStripePreset, sideStripePrimaryColor, sideStripeSecondaryColor, sleeveStripePrimaryColor, sleeveStripeSecondaryColor must be "".
- Exactly one of vertical/horizontal/custom OR none should be active.
- Collar defaults: use only neckCircleColor and keep leftNeckCircleColor="".
- Only set leftNeckCircleColor when design_brief explicitly requests split/asymmetric collar.
- Prefer defaultVertical or defaultVerticalCenterAlt before detailed variants unless explicitly requested.
- Keep stripes visible by swapping layer assignment, not by changing the club palette: baseColor should usually default to primary, and stripePrimaryColor should usually use the opposite of base between primary and secondary.
- Player text:
  - If include_player_text=true: set footballBackEnabled=true and include backside player text.
  - Defaults: footballBackFontFamily="Barlow Condensed", footballBackFontWeight=700, footballBackTextColor="", footballBackTextOutlineEnabled=false, footballBackTextOutlineColor="#000000", footballBackTextOutlineWidth=2, footballBackNameCurveAmount=0, footballBackNameSize=4, footballBackNumberSize=16, footballBackNameY=11, footballBackNumberY=21.
  - If include_player_text=false: footballBackEnabled=false and footballBackName/footballBackNumber="" (keep other player text defaults valid).
`,
  handball: `Sport target: handball
- sport must be "handball".
- Treat handball exactly like football for now.
- Default preference: keep designs simple and common. Use vertical stripes first for classic clubs unless design_brief explicitly asks otherwise.
- Allowed vertical presets: defaultVertical, defaultVerticalCenterAlt, verticalThinFull, rightThinDouble_SP, rightThinDouble_PS, rightThinSingle_S, verticalDoubleBand, verticalTripleBand, verticalDoubleCenterSplit
- Allowed horizontal presets: regularQuadStripe, regularTripleStripe, twoColorDoubleStripe, singleBand, threeColorBand
- Allowed custom presets: diagonalLeft, diagonalRight, diagonalHalfHalf1, diagonalHalfHalf2, arrow, cross, split
- sideStripePreset, sideStripePrimaryColor, sideStripeSecondaryColor, sleeveStripePrimaryColor, sleeveStripeSecondaryColor must be "".
- Exactly one of vertical/horizontal/custom OR none should be active.
- Collar defaults: use only neckCircleColor and keep leftNeckCircleColor="".
- Only set leftNeckCircleColor when design_brief explicitly requests split/asymmetric collar.
- Prefer defaultVertical or defaultVerticalCenterAlt before detailed variants unless explicitly requested.
- Keep stripes visible by swapping layer assignment, not by changing the club palette: baseColor should usually default to primary, and stripePrimaryColor should usually use the opposite of base between primary and secondary.
- Player text:
  - If include_player_text=true: set footballBackEnabled=true and include backside player text.
  - Defaults: footballBackFontFamily="Barlow Condensed", footballBackFontWeight=700, footballBackTextColor="", footballBackTextOutlineEnabled=false, footballBackTextOutlineColor="#000000", footballBackTextOutlineWidth=2, footballBackNameCurveAmount=0, footballBackNameSize=4, footballBackNumberSize=16, footballBackNameY=11, footballBackNumberY=21.
  - If include_player_text=false: footballBackEnabled=false and footballBackName/footballBackNumber="" (keep other player text defaults valid).
`,
};

export function getPromptTemplateForSport(sport: SportVariant) {
  return `${COMMON}
${SPORT_RULES[sport]}

Self-check before final output:
- sport matches the target sport exactly
- enums are valid for that sport
- non-applicable fields are ""
- all non-empty colors are uppercase #RRGGBB
- top-level color fields equal state color fields
- required keys exist, no extra keys exist
- output is exactly one JSON object`;
}

export function getReadyPromptForSport(
  sport: SportVariant,
  teamName: string,
  leagueOrCountry: string,
  designBrief?: string,
  includePlayerText = false,
) {
  return getPromptTemplateForSport(sport)
    .replace("{{TEAM_NAME}}", teamName)
    .replace("{{LEAGUE_OR_COUNTRY}}", leagueOrCountry)
    .replace("{{DESIGN_BRIEF}}", designBrief || "")
    .replace("{{INCLUDE_PLAYER_TEXT}}", includePlayerText ? "true" : "false");
}
