const API_BASE_URL = "https://localhost:5188";
export enum LanguageType {
  Ru = 1,
  En = 2,
  Ka = 3,
}


export interface CreateOtpRequest {
  email: string;
  password?: string | null;
}


export interface ValidateOtpRequest {
  email: string;
  otpNumber: string;
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
   "/api/auth/createOtp",
   payload
 );
}



export function validateOtp(
 payload: ValidateOtpRequest
){
 return apiFetch(
   "/api/auth/validateOtp",
   payload
 );
}



export function registerUser(
 payload: RegisterUserRequest
){
 return apiFetch(
   "/api/auth/registerUser",
   payload
 );
}

