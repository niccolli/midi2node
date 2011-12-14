var midi = require('midi');

var input = new midi.input();
var output = new midi.output();

//input.getPortCount();
//input.getPortName(0);

output.openVirtualPort('NodeMidi');

var state='X', m1=0;
var MSB=0, LSB=[];
var x=0, y=0, z=0;

input.on('message', function(deltaTime, message) {
	// m1スライダをガチャガチャ
	if (message[0]==176 && message[1]==1){
		m1=message[2];
		output.sendMessage(message);
	}
	// ノブをいじった信号
	else if(message[0]==176 && message[1]==99){
		if(message[2]==0){ // knob X
			state = 'X';
		}
		if(message[2]==2){ // knob Y
			state = 'Y';
		}
		if(message[2]==4){ // knob Z
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
		var channel = (m1>=64)?177:176;
		switch(state){
			case 'X':
				var temp = MSB*128 + LSB;
				if(temp > (3*128 + 127)){
					temp = 3*128 + 127;
				}
				x = Math.round(temp / (3*128 + 127) * 127)*2;
				output.sendMessage([channel,2,x]);
				break;
			case 'Y':
				y = Math.round(LSB / 100 * 127)*2;
				output.sendMessage([channel,4,y]);
				break;
			case 'Z':
				z = Math.round(LSB / 100 * 127)*2;
				output.sendMessage([channel,8,z]);
				break;
			default:
				break;
		}

	} else {
		//output.sendMessage(message);
	}

	//console.log('m:' + message + ' d:' + deltaTime);
}); 

input.openPort(0);

