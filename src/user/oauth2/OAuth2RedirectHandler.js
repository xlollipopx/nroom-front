import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import {apiBaseUrl} from '../../config/dev'


class OAuth2RedirectHandler extends Component {

    getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

        var results = regex.exec(this.props.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    getParamsUrl(url) {
        let arr = url.split('?');
        return arr.length > 0 ? arr[1] : '';
    }

    render() {
        axios.defaults.withCredentials = true;
        const state = this.getUrlParameter('state');
        console.log(state);
        const cookies = new Cookies();
        const authId = cookies.get('Auth-Identification', { path: '/' });
        if (!cookies.get("isLogedIn")) {
            axios.get(apiBaseUrl + "/login/oauth2/code/google?" + this.getParamsUrl(decodeURIComponent(this.props.location.search)),
                {
                    headers: {
                        'Auth-Identification': authId
                    }
                })
                .then(function (response) {
                    console.log(response);
                    // cookies.set('Auth-Identification', response.headers['auth-identification'], { path: '/' });
                    // window.location.replace(response.data.redirectUrl)
                })
        }
        cookies.set("isLogedIn", true);


        // const error = this.getUrlParameter('error');

        // if(token) {
        //     localStorage.setItem(ACCESS_TOKEN, token);
        //     return <Redirect to={{
        //         pathname: "/profile",
        //         state: { from: this.props.location }
        //     }}/>; 
        // } else {
        //     return <Redirect to={{
        //         pathname: "/login",
        //         state: { 
        //             from: this.props.location,
        //             error: error 
        //         }
        //     }}/>; 
        // }
        return <div>
            Loading..
        </div>
    }
}

export default OAuth2RedirectHandler;