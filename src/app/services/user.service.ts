import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/users/register.dto';
import { LoginDTO } from '../dtos/users/login.dtos';
import { environment } from '../environments/environment';
import { UserResponse } from '../responses/user/user.response';
import { UpdateUserDTO } from '../dtos/users/update.user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister = `${environment.apiBaseUrl}/users/register`;
  private apiLogin = `${environment.apiBaseUrl}/users/login`;
  private apiUserDetail = `${environment.apiBaseUrl}/users/details`;
  
  private apiConfig = {
    headers: this.createHeaders()
  }

  constructor(private http : HttpClient) { }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'en'
    });
  }

  register(registerDTO: RegisterDTO):Observable<any> {
    return this.http.post(this.apiRegister, registerDTO, this.apiConfig);
  }
  login(loginDTO: LoginDTO):Observable<any> {
    return this.http.post(this.apiLogin, loginDTO, this.apiConfig);
  }

  getUserDetail(token: string) {
    return this.http.post(this.apiUserDetail, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }

  saveUserResponseToLocalStorage(userResponse?: UserResponse) {
    try {
      debugger
      if (userResponse == null || !userResponse) {
        return;
      }
      // Convert the userResponse object to a JSON string
      const userResponseJSON = JSON.stringify(userResponse);

      // Save the JSON string to local storage with a key (e.g., "userResponse")
      localStorage.setItem('user', userResponseJSON);

      console.log('User response saved to local storage.');
    } catch (error) {
      console.error('Error saving user response to local storage: ', error);
    }
  }

  getUserResponseFromLocalStorage ():UserResponse | null {
    try {
      // Retrieve the JSON string from local storage using they key
      const userResponseJSON = localStorage.getItem('user');
      if (userResponseJSON == null || userResponseJSON == undefined) {
        return null;
      }
      // Parse the JSON string back to an object
      const userResponse = JSON.parse(userResponseJSON);
      console.log('User repsonse retrieved from local storage.');
      return userResponse;
    } catch (error) {
      console.error('Error retrieving user response from local storage: ', error);
      return null; // Return null or handle the error as needed
    }
  }

  removeUserFromLocalStorage(): void {
    try {
      // Remove the user data from local storage using the key
      localStorage.removeItem('user');
      console.log('User data removed from local storage.');
    } catch (error) {
      console.error('Error removing user data from local storage: ', error);
      // Handle the error as needed
    }
  }

  updateUserDetail (token: string, updateUserDTO: UpdateUserDTO) {
    debugger
    let userResponse = this.getUserResponseFromLocalStorage();
    return this.http.put(`${this.apiUserDetail}/${userResponse?.id}`, updateUserDTO, {
      headers: new HttpHeaders ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }
}
