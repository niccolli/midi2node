var midi = require('midi');

var input = new midi.input();

input.getPortCount();

input.getPortName(0);

var state;
var MSB=0, LSB=[];
input.on('message', function(deltaTime, message) {
	// ノブをいじった信号
	if(message[0]==176 && message[1]==99){
		if(message[2]==0){ // knob X
			state = 'X';
			console.log("X");
		}
		if(message[2]==2){ // knob Y
			console.log("Y");
			state = 'Y';
		}
		if(message[2]==4){ // knob Z
			console.log("Z");
			state = 'Z';
		}
	}
	// MSBがきましたよ
	else if(message[0]==176 && message[1]==6){
		MSB = message[2]; // MSBを保存(必ずこのあとにLSBが来る)
	}
	// LSBがきましたよ
	else if(message[0]==176 && message[1]==38){
		LSB = message[2];
		switch(state){
			case 'X':
				var temp = MSB*128 + LSB;
				if(temp > (3*128 + 127)){
					temp = 3*128 + 127;
				}
				temp = Math.round(temp / (3*128 + 127) * 127);
				console.log("X: "+temp);
				break;
			case 'Y':
				var temp = Math.round(LSB / 100 * 127);
				console.log("Y: "+temp);
				break;
			case 'Z':
				var temp = Math.round(LSB / 100 * 127);
				console.log("Z: "+temp);
				break;
			default:
				break;
		}
	} else {
		// なにもしない
	}

	//console.log('m:' + message + ' d:' + deltaTime);
}); 

input.openPort(0);

