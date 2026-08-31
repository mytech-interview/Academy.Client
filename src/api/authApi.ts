import { API_BASE_URL } from "../services/baseApi";

export enum LanguageType {
  Ru = 1,
  En = 2,
  Ka = 3,
}


export interface CreateOtpRegistrationRequest {
  email: string;
  password?: string | null;
}

export function createOtpRegistration(
 payload: CreateOtpRegistrationRequest
){
 return apiFetch(
   "/auth/createOtpRegistration",
   payload
 );
}

export interface CreateOtpRequest {
  email: string;
  password?: string | null;
}


export interface ValidateOtpRequest {
  email: string;
  otpNumber: string;
}
export interface ValidateOtpRegistrationPayload {
  email: string;
  otpNumber: string;
  firstName: string;
  lastName: string;
  password: string;
  telephone: string;
  roleId: number;
}


export interface RegisterUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  telephone: string;
  roleId: number;
}



async function apiFetch(path: string, body: unknown) {

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify(body)
  });


  if(!response.ok){

    let message = "Request failed";

    try{
      const data = await response.json();
      message =
        data?.message ||
        data?.title ||
        message;

    }catch{}

    throw new Error(message);
  }


  const text = await response.text();

  return text ? JSON.parse(text) : null;
}



export function createOtp(
 payload: CreateOtpRequest
){
 return apiFetch(
   "/auth/createOtp",
   payload
 );
}




export function validateOtp(
 payload: ValidateOtpRequest
){
 return apiFetch(
   "/auth/validateOtp",
   payload
 );
}

export function validateOtpRegitration(
  payload: ValidateOtpRegistrationPayload
) {
  return apiFetch(
    "/auth/validateOtpRegistration",
    payload
  );
}



export function registerUser(
 payload: RegisterUserRequest
){
 return apiFetch(
   "/auth/registerUser",
   payload
 );
}

