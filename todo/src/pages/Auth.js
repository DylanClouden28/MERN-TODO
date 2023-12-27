import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/auth';
import { getAuth } from 'firebase/auth';



const API_BASE= 'http://localhost:4001/todo';

const uiConfig = {
    signInSuccessUrl: 'todo',
    signInOptions: [
      {
        provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        defaultCountry: 'US',
        recaptchaParameters: {
          type: 'image', // 'audio'
          size: 'invisible', // 'invisible' or 'compact'
          badge: 'bottomleft' //' bottomright' or 'inline' applies to invisible.
        },
      }
    ],
  };

function Auth(){

    console.log(uiConfig)

    return (
        <div>
            <h1>Welcome to My Awesome App</h1>
            <StyledFirebaseAuth uiConfig={uiConfig}firebaseAuth={firebase.auth()} />
        </div>
    );
}

export default Auth;