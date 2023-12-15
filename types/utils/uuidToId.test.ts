import { v4 as uuidv4 } from "uuid";
import { describe, expect, it } from "vitest";
import { ModelIndicator, getBase58CheckIdFromUuidAndModel, getUuidAndModelFromBase58CheckId } from "./base58checkId";

function getRandomModelIndicator(): ModelIndicator {
  const modelIndicators = Object.values(ModelIndicator).filter((value) => typeof value === "number");
  const randomIndex = Math.floor(Math.random() * modelIndicators.length);
  return modelIndicators[randomIndex] as ModelIndicator;
}

describe("base58check functions", () => {
  it("encodes and decodes UUID and model correctly", () => {
    const uuid = "123e4567-e89b-12d3-a456-426614174000"; // Sample UUID
    const model = ModelIndicator.User;

    // Test encoding
    const encodedId = getBase58CheckIdFromUuidAndModel(uuid, model);
    expect(encodedId).toBeDefined();

    // Test decoding
    const { uuid: decodedUuid, model: decodedModel } = getUuidAndModelFromBase58CheckId(encodedId);
    expect(decodedUuid).toBe(uuid);
    expect(decodedModel).toBe("User");
  });

  it("encodes and decodes random UUIDs and models correctly", () => {
    const numberOfTests = 100000; // Configure the number of random tests

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
