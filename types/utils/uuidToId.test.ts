import { v4 as uuidv4 } from "uuid";
import { Test, describe, expect, it } from "vitest";
import {
  ModelIndicator,
  ModelIndicatorNameType,
  ModelIndicatorType,
  base58CheckIdDefault,
  getBase58CheckIdFromUuidAndModel,
  getUuidAndModelFromBase58CheckId,
} from "./base58checkId";
import { uuidIdDefault } from "./uuidId";

function getRandomModelIndicator(): ModelIndicator {
  const modelIndicators = Object.values(ModelIndicator).filter((value) => typeof value === "number");
  const randomIndex = Math.floor(Math.random() * modelIndicators.length);
  return modelIndicators[randomIndex] as ModelIndicator;
}

describe("base58check functions", () => {
  it("encodes and decodes UUID and model correctly", () => {
    type TestCase = {
      model?: ModelIndicatorNameType | ModelIndicatorType;
      uuid?: string;
      encodedId?: string;
    };
    const cases: Array<TestCase> = [
      { uuid: uuidIdDefault, model: "user" },
      { encodedId: "2y8ShWp5uBa1jbLNKCF5yorW3t98J" },
      { uuid: uuidIdDefault, model: "default" },
      { encodedId: base58CheckIdDefault },
    ];
    for (const [index, test] of cases.entries()) {
      if (test?.uuid && test.model) {
        // Test encoding
        let model: ModelIndicatorType;
        if (typeof test.model === "string") {
          model = ModelIndicator[test.model as ModelIndicatorNameType];
        } else {
          model = test.model;
        }

        const encodedId = getBase58CheckIdFromUuidAndModel(test.uuid, model);
        expect(encodedId).toBeDefined();

        // Test decoding
        const { uuid: decodedUuid, model: decodedModel } = getUuidAndModelFromBase58CheckId(encodedId);
        expect(decodedUuid).toBe(test.uuid);
        expect(decodedModel).toBe(test.model);
        console.log(
          "\n" + `Case #${index}: test =`,
          test,
          "\nbase58check",
          `encoded: ${encodedId} from uuid=${test.uuid} model=${ModelIndicator[test.model]}`,
        );
        console.log(`base58check decoded  ${encodedId}      uuid=${decodedUuid} model=${decodedModel}`);
      } else if (test.encodedId) {
        // Test decoding
        const { uuid: decodedUuid, model: decodedModel } = getUuidAndModelFromBase58CheckId(test.encodedId);

        // Test encoding
        const encodedId = getBase58CheckIdFromUuidAndModel(
          decodedUuid,
          ModelIndicator[decodedModel as ModelIndicatorNameType],
        );
        expect(encodedId).toBeDefined();

        const { uuid: decodedUuid2, model: decodedModel2 } = getUuidAndModelFromBase58CheckId(encodedId);
        expect(decodedUuid2).toBe(decodedUuid);
        expect(decodedModel2).toBe(decodedModel);

        console.log(
          "\n" + `Case #${index}: test =`,
          test,
          "\nbase58check",
          `test.encodedId=${test.encodedId} -->  decodedUuid=${decodedUuid}  decodedModel=${decodedModel}`,
        );
        console.log(
          `base58check      encodedId=${encodedId} <--  decodedUuid=${decodedUuid}  decodedModel=${decodedModel}`,
        );
        console.log(
          `base58check      encodedId=${encodedId} --> decodedUuid2=${decodedUuid2} decodedModel2=${decodedModel2}`,
        );
      } else {
        throw Error(`encodes and decodes UUID and model correctly: invalid test #${index}: ${JSON.stringify(test)}`);
      }
    }
  });

  it("encodes and decodes random UUIDs and models correctly", () => {
    const numberOfTests = 1000; // Configure the number of random tests

    for (let i = 0; i < numberOfTests; i++) {
      const randomUuid = uuidv4();
      const randomModelIndicator = getRandomModelIndicator();

      // Test encoding
      const encodedId = getBase58CheckIdFromUuidAndModel(randomUuid, randomModelIndicator);
      expect(encodedId).toBeDefined();

      // Test decoding
      const { uuid: decodedUuid, model: decodedModel } = getUuidAndModelFromBase58CheckId(encodedId);
      expect(decodedUuid).toBe(randomUuid);
      expect(decodedModel).toBe(ModelIndicator[randomModelIndicator]);

      // if (i % Math.round(numberOfTests / 100) === 0) {
      //   console.log(
      //     `base58check encoded: ${encodedId} from model=${ModelIndicator[randomModelIndicator]} uuid=${randomUuid}`,
      //   );
      //   console.log(`base58check decoded  ${encodedId}:     model=${decodedModel} uuid=${decodedUuid}`);
      // }
    }
  });
});
