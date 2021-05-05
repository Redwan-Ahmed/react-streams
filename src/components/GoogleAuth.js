import React from 'react';
import { connect } from 'react-redux';
import { signIn, signOut } from '../actions';

// Client ID: 829736648275-2k3bsg1p1n5n8dkgi43qb67qpirdrmls.apps.googleusercontent.com
// docs: https://developers.google.com/identity/sign-in/web/reference#gapiauth2getauthinstance

class GoogleAuth extends React.Component {

    componentDidMount() {
        // calling the google api (gapi) passing in our client id and scope (email)
        window.gapi.load('client:auth2', () => {
            window.gapi.client.init({
                clientId: '829736648275-2k3bsg1p1n5n8dkgi43qb67qpirdrmls.apps.googleusercontent.com',
                scope: 'email'
            })
            .then(() => {
                // this.auth return an object from auth2.getAuthInstance();
                this.auth = window.gapi.auth2.getAuthInstance();
                // return a boolean if the user is signed in
                this.onAuthChange(this.auth.isSignedIn.get());
                // adding a listner to any changes on isSignedIn
                this.auth.isSignedIn.listen(this.onAuthChange);
            });
        });
    }

    // listening and setting our state isSignedIn
    onAuthChange = (isSignedIn) => {
        if (isSignedIn) {
            this.props.signIn(this.auth.currentUser.get().getId());
        } else {
            this.props.signOut();
        }
    };

    //Helper functions for sign in & sign out
    onSignIn = () => {
        this.auth.signIn();
    };

    onSignOut = () => {
        this.auth.signOut();
    };

    renderAuthButton() {
        if (this.props.isSignedIn === null) {
            return null;
        } else if (this.props.isSignedIn) {
            return (
                <button onClick={this.onSignOut} className="ui purple google button">
                    <i className="google icon"/>
                    Sign Out
                </button>
            );
        } else {
            return (
                <button onClick={this.onSignIn} className="ui purple google button">
                <i className="google icon"/>
                Sign In with Google
                </button>
            );
        }
    }

    render () {
        return (
            <div>{this.renderAuthButton()}</div>
        );
    }
}

const mapStateToProps = (state) => {
    return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth);