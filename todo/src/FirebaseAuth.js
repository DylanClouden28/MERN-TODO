import React, { Component } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css'

class FirebaseAuth extends Component {
    componentDidMount() {
        // Check if we have already initialized an AuthUI instance
        if (!firebaseui.auth.AuthUI.getInstance()) {
          this.ui = new firebaseui.auth.AuthUI(firebase.auth());
        } else {
          // Use the existing instance
          this.ui = firebaseui.auth.AuthUI.getInstance();
        }
        this.ui.start('#firebaseui-auth-container', this.props.uiConfig);
      }

  componentWillUnmount() {
    if (this.ui) {
        this.ui.reset()
    }

     // Clean up reCAPTCHA instances
     window.grecaptcha = null;
     window.recaptcha = null;
 
     // Remove reCAPTCHA iframes
     document.querySelectorAll('iframe[src*=recaptcha]').forEach(iframe => iframe.remove());
  }

  render() {
    return (
      <div id="firebaseui-auth-container"></div>
    );
  }
}

export default FirebaseAuth;
