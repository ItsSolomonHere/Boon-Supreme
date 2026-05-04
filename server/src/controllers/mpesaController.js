import { randomBytes } from "crypto";

export async function stkPushStub(_req, res, next) {
  try {
    const id = `ws_CO_${randomBytes(8).toString("hex")}`;
    res.json({
      CheckoutRequestID: id,
      MerchantRequestID: `MER_${randomBytes(6).toString("hex")}`,
      ResponseCode: "0",
      ResponseDescription: "Success. Request accepted for processing (stub)",
    });
  } catch (e) {
    next(e);
  }
}
