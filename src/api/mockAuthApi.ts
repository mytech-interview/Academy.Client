import { MOCK_OTP_CODE } from '../data/mockData';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

/** Always succeeds – simulates sending OTP email */
export async function mockCreateOtp(_email: string): Promise<void> {
    await delay(600);
}

/** Accepts MOCK_OTP_CODE ('123456') only */
export async function mockValidateOtp(_email: string, code: string): Promise<void> {
    await delay(700);
    if (code !== MOCK_OTP_CODE) throw new Error('invalid_otp');
}