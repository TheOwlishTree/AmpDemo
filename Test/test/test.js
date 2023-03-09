const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

const client = require('./tcpClient')(3001, 'localhost');


describe('-------Smart Gym--------', function () {
    before(() => {
        console.log(`
------------------------------------------
please run the server at localhost:3000.
our smart gym initial state expected to be:
 1,‘AirSquatMachine’,off
 2 ‘LegPress’,off,100
------------------------------------------
`);
        return client.connect()
            .then(() => console.log('Connected to server'))
            .catch(() => console.error('Failed to connect to server. \nPlease make sure server is running on localhost:3000\n'));

    });

    describe('showMachines', function () {

        it(`should return the initial state:
             1,AirSquatMachine,off
             2 LegPress,off,100`, function () {
            return client.sendData('showMachines').should.eventually.include('1,AirSquatMachine,off').and.include('2,LegPress,off,100');
        });
    });

    describe('turn on AirSquatMachine(1) ', function () {
        it(`after action showMachines should include:
                1,AirSquatMachine,on`, function () {
            return client.sendData('switch 1 on')
                .then(()=> client.sendData('showMachines'))
                .should.eventually.include('1,AirSquatMachine,on');
        });

        describe('turn on LegPress(2)', function () {
            it(`after action showMachines should include:
                2,LegPress,on,100`, function () {
                return client.sendData('switch 2 on')
                    .then(()=> client.sendData('showMachines'))
                    .should.eventually.include('2,LegPress,on,100');
            });
            describe('setWeight 2 150', function () {
                it(`after action listDevices should contain line:
                2,LegPress,on,100`, function () {
                    return client.sendData('setWeight 2 30')
                        .then(()=> client.sendData('showMachines'))
                        .should.eventually.include('2,LegPress,on,30');
                });
            })
        })
    })
    after(function(){
        if (client.isConnected()){
            return client.disconnect()
                .then(()=>console.log('Disconnected from server'))
                .catch(err=> console.error('Failed to disconnect from server'))
        }

    });
});

