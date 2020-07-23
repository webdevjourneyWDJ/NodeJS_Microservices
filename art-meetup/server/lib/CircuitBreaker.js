const axios = require('axios');

class CircuitBreaker {
    constructor(){
        this.states = {};
        this.failureThreshold = 5;
        this.coolDownPeriod = 10;
        this.requestTimeout = 2;
    }

    async callService(reqOptions){
        const endpoint = `${reqOptions.method}:${reqOptions.url}`;

        if(!this.canRequest(endpoint)) return false;

        reqOptions.timeout = this.requestTimeout * 1000;

        try{
            const res = await axios(reqOptions);
            this.onSuccess(endpoint);
            return res.data;
        }catch(err){
            this.onFailure(endpoint);
            return false;
        }
      }

    onSuccess(endpoint) {
        this.initState(endpoint);
    }

    onFailure(endpoint){
        const state = this.states[endpoint];
        state.failures +=1;
        if(state.failures > this.failureThreshold){
            state.circuit = "OPEN";
            state.nextTry = new Date() / 1000 + this.coolDownPeriod;
            console.log(`Alert! Circuit for ${endpoint} is in state 'OPEN'`);
        }
    }

    canRequest(endpoint){
        if(!this.states[endpoint]) this.initState(endpoint);
        const state = this.states[endpoint];
        if(state.circuit === 'CLOSED') return true;
        const now = new Date() / 1000;
        if(state.nextTry <= now){
            state.circuit = "HALF";
            return true;
        }

        return false;
    }

    initState(endpoint){
        this.states[endpoint] = {
            failures: 0,
            coolDownPeriod: this.coolDownPeriod,
            circuit: "CLOSED",
            nextTry: 0
        }
    }
}

module.exports = CircuitBreaker; 