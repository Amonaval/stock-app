import defaultServiceBase from './serviceClass';

class GameDemo {
    constructor(ServiceBase = defaultServiceBase) {
        this.serviceBase = ServiceBase;
        this.getChallengeInput = this.getChallengeInput.bind(this);
        this.setChallengeOutput = this.setChallengeOutput.bind(this);
        this.getChallenge = this.getChallenge.bind(this);
        this.start_game = this.start_game.bind(this);
    }

    getChallenge({config} = {}){
        return this.serviceBase.ajax.get('/challenge', config);
    }

    getChallengeInput({config} = {}){
        return this.serviceBase.ajax.get('/challenge/input', config);
    }

    setChallengeOutput(data, config){
        return this.serviceBase.ajax.post(`/challenge/output`, data, config);
    }

    async start_game() {
        
        let getChallenge = await this.getChallenge();
        const getInput = await this.getChallengeInput();
        const inputData = getInput.data;

        /**** Challenge 1 ******
        const data = {count : getInput.data.length};
        */

        
        
       
        /**** Challenge 2 ****** 
        
        const allCategory = [];
        for (var i in inputData){
            if(inputData[i].category == 'Electronics') {
                allCategory.push(inputData[i].category);
            }
        }
        const data = {count : allCategory.length};
        */

        /**** Challenge 3 *****

        const finalResult = {};
        for (var i in inputData){
            const endDate = new Date(inputData[i].endDate);
            const startDate = new Date(inputData[i].startDate);
            if((inputData[i].endDate === null || endDate >= new Date()) && startDate <= new Date()) {
                let currentVal = finalResult[inputData[i].category];
                if(currentVal) {
                    finalResult[inputData[i].category] = ++currentVal;
                } else {
                    finalResult[inputData[i].category] = 1;
                }
                
            }
        }
        const data = finalResult;
        */

         /**** Challenge 4 ******/

        let totalValue = 0;
        for (var i in inputData){
            const endDate = new Date(inputData[i].endDate);
            const startDate = new Date(inputData[i].startDate);
            if((inputData[i].endDate === null || endDate >= new Date()) && startDate <= new Date()) {
                totalValue += inputData[i].price;
            }
        }
       const data = { totalValue };
       const response = await this.setChallengeOutput(data);
        
    }
}

const gameDemo = new GameDemo();
gameDemo.start_game();