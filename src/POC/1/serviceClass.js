'use strict';
const axios = require('axios');

class ServiceClass {

    constructor(config) {
        this.getMethod = this.getMethod.bind(this);
        this.postMethod = this.postMethod.bind(this);
        this.request = axios.create({
            timeout: 1000,
            headers: {'userId': 'fszT_FdvN'}
        });
    }

    get ajax() {
        return {
            get: this.getMethod,
            post: this.postMethod
        };
    }

    static get normalize() {
        return (response) => {
            return response;
        };
    }

     getMethod(url, config, normalize = ServiceClass.normalize) {
        return this.request.get(url, config).then((response) => {
            return normalize(response);
        }).catch((error) => {
            // throw error
        });
    }

    postMethod(url, data, config, normalize = ServiceClass.normalize) {
        return this.request.post(url, data, config).then((response) => {
            return normalize(response);
        }).catch((error) => {
             // throw error
        });
    }
}

const ServiceBase = new ServiceClass();
export default ServiceBase;
export {
    ServiceClass
};