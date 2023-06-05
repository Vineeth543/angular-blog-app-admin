import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
          this.loadUser();
          this.loggedIn.next(true);
          this.router.navigate(['/']);
        })
        .catch((error) => this.toastr.warning(error));
    } catch (error: string | any) {
      this.toastr.warning(error);
    }
  }

  loadUser(): void {
    this.afAuth.authState.subscribe((user) =>
      localStorage.setItem('user', JSON.stringify(user))
    );
  }

  logout(): void {
    this.afAuth
      .signOut()
      .then(() => {
        this.toastr.success('Logged out successfullly. 😊');
        this.loggedIn.next(false);
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
      })
      .catch((error) => this.toastr.warning(error));
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
}
