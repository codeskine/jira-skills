// Rules for the behavioural fixtures in evals/evals.json.
//
// A fixture names entities a runner has to line up in whatever project they run against — item
// keys, fix versions — and the sandbox never holds the ones the fixtures were written with. The
// run of 2026-09-06 substituted them and worked the mapping out on the spot, which means two
// runners will not choose the same one and neither run is comparable to the other.
//
// So a fixture declares what it names, in `entities`, and the procedure says a runner substitutes
// only what is declared. That declaration cannot be derived: `sel-capture-6` says "They're on 4.9"
// of a product, inside a customer's sentence, and the fixture exists to assert that naming a
// product does not clear the intake floor. A rule that swapped it for a fix version would quietly
// test something else.
//
// What can be derived is the omission. An item key has an unmistakable shape, so a prompt carrying
// one and no declaration is an author who forgot — and that is what this checks. Version-shaped
// tokens are left to the author for the reason above.
//
// `scripts/evals-fixtures.test.mjs` covers these rules, and `npm test` runs it. Add a case with a
// rule: the real fixtures all pass, so they cannot tell a working rule from one that stopped
// running.

// PROJ-88, KAN-4, ST-1 — an uppercase project key, a hyphen, a number. Nothing else in a prompt
// takes this shape, which is why the omission is checkable and the version is not.
const ITEM_KEY = /\b[A-Z][A-Z0-9]*-\d+\b/g;

const CATEGORIES = new Set(["selection", "gate", "ordering", "handover"]);

/**
 * @param fixture one entry of the `evals` array.
 * @returns every problem found, in reading order. Never stops at the first.
 */
export function validateFixture(fixture) {
  const errors = [];
  const { id, category, prompt, entities } = fixture;

  if (typeof id !== "string" || id === "") return ["id is missing"];
  if (!CATEGORIES.has(category))
    errors.push(`category "${category ?? ""}" is not one of the four`);
  if (typeof prompt !== "string" || prompt === "") {
    errors.push("prompt is missing");
    return errors;
  }

  if (entities !== undefined) {
    if (!Array.isArray(entities) || entities.some((e) => typeof e !== "string"))
      errors.push("entities is not a list of strings");
    else
      for (const entity of entities)
        if (!prompt.includes(entity))
          errors.push(`entities names "${entity}", which the prompt does not`);
  }

  const declared = new Set(Array.isArray(entities) ? entities : []);
  const keys = [...new Set(prompt.match(ITEM_KEY) ?? [])];
  for (const key of keys)
    if (!declared.has(key))
      errors.push(
        `prompt names the work item "${key}", which entities does not declare`,
      );

  return errors;
}

/**
 * @param file the parsed contents of evals/evals.json.
 * @returns every problem found, each prefixed with the fixture it belongs to.
 */
export function validateFixtures(file) {
  const errors = [];
  const fixtures = file?.evals;

  if (!Array.isArray(fixtures)) return ['has no "evals" array'];

  const seen = new Set();
  for (const fixture of fixtures) {
    const id = typeof fixture?.id === "string" ? fixture.id : "<no id>";
    if (seen.has(id)) errors.push(`${id}: id is used more than once`);
    seen.add(id);
    for (const error of validateFixture(fixture))
      errors.push(`${id}: ${error}`);
  }

  return errors;
}
