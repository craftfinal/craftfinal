import bs58check from "bs58check";

export enum ModelIndicator {
  Default = 0, // Default value indicates a programmatically generated model
  User = 32, // The user is at the center of our design philosophy :-)
  Organization = 33, // Content models start at 32
  Role = 34,
  Achievement = 35,
  AuthenticationProvider = 128, // Auxiliary models start at 128
  Invalid = 255, // Reserved to indicate an invalid model
}

export type ModelIndicatorType = keyof typeof ModelIndicator;

// export function getIdFromUuidAndModel(uuid: string, model: ModelIndicatorType): string {
//   const indicator = ModelIndicator[model];
//   const buffer = Buffer.from(indicator + uuid.replace(/-/g, ""), "hex");
//   return bs58check.encode(buffer);
// }

export function getIdFromUuidAndModel(uuid: string, model: ModelIndicator): string {
  const buffer = Buffer.from([model, ...Buffer.from(uuid.replace(/-/g, ""), "hex")]);
  return bs58check.encode(buffer);
}

export function getUuidAndModelFromId(id: string): { uuid: string; model: ModelIndicatorType } {
  const decoded = bs58check.decode(id);
  const buffer = Buffer.from(decoded.buffer, decoded.byteOffset, decoded.byteLength);
  const hex = buffer.toString("hex");

  // The first byte is the model indicator
  const modelIndicator = buffer[0];
  const model = ModelIndicator[modelIndicator] as ModelIndicatorType;
  if (model === undefined) {
    throw new Error(`Unknown model indicator: ${modelIndicator}`);
  }

  // The rest of the buffer is the UUID in hex format
  const uuid = [hex.slice(2, 10), hex.slice(10, 14), hex.slice(14, 18), hex.slice(18, 22), hex.slice(22)].join("-");

  return { uuid, model };
}
