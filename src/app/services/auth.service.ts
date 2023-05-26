import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private afAuth: AngularFireAuth
  ) {}

  login(email: string, password: string): void {
    try {
      this.afAuth
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          this.toastr.success('Logged in successfullly. 😊');
          this.router.navigate(['/']);
        })
        .catch((error) => this.toastr.warning(error));
    } catch (error: string | any) {
      this.toastr.warning(error);
    }
  }
}
