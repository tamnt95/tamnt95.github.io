const socket = io('https://mypeer3000.herokuapp.com/');
$( document ).ready( function () {
	$.ajax ({
		url: "https://global.xirsys.net/_turn/tamnt95.github.io/",
		type: "PUT",
		async: false,
		headers: {
			"Authorization": "Basic " + btoa("poseidon12495:c7f82d3e-5d8c-11e8-8e2a-6011996e9463")
		},
		success: function (res){
			console.log("ICE List: "+res.v.iceServers);
		}
	});
});

$(function(){
        // Get Xirsys ICE (STUN/TURN)
        if(!ice){
        	ice = new $xirsys.ice('/webrtc');
        	ice.on(ice.onICEList, function (evt){
        		console.log('onICE ',evt);
        		if(evt.type == ice.onICEList){
        			create(ice.iceServers);
        		}
        	});
        }
    });
  // function create() {
  //       // PeerJS object
        
  //       peer = new Peer({ key: 'peerjs', host: 'frtwebrtc.herokuapp.com', port: 443, secure: true, debug: 3, config: ice.iceServers});
  //       peer.on('open', function(){
  //           $('#my-peer').text(peer.id);
  //       });
  //       // Receiving a call
  //       peer.on('call', function(call){
  //           // Answer the call automatically (instead of prompting user) for demo purposes
  //           call.answer(window.localStream);
  //           step3(call);
  //       });
  //       peer.on('error', function(err){
  //           alert(err.message);
  //           // Return to step 2 if error occurs
  //           step2();
  //       });
  //       setup();
  //   }
  //    function setup() {
  //       $('#btnCall').click(function(){
  //           // Initiate a call!
  //           var call = peer.call($('#callto-id').val(), window.localStream);
  //           step3(call);
  //       });
  //       $('#end-call').click(function(){
  //           window.existingCall.close();
  //           step2();
  //       });
  //       // Retry if getUserMedia fails
  //       $('#step1-retry').click(function(){
  //           $('#step1-error').hide();
  //           step1();
  //       });
  //       // Get things started
  //       step1();
  //   }
$('#div-chat').hide();

socket.on('DANH_SACH_ONLINE', arrUserInfo => {
	$('#div-chat').show();
	$('#div-dangky').hide();

	arrUserInfo.forEach(user => {
		// console.log(arrUserInfo);
		const { ten, peerID } = user;
		$('#uluser').append(`<li id="${peerID}">${ten}</li>`); // O day su dung dau ` o duoi nut ESC
	});
	socket.on('CO_NGUOI_DUNG_MOI', user => {
	// console.log(user);
	const{ten, peerID} = user;
		$('#uluser').append(`<li id="${peerID}">${ten}</li>`);// O day su dung dau ` o duoi nut ESC
	});
	socket.on('AI_DO_DA_NGAT_KET_NOI', peerID => {
		$(`#${peerID}`).remove();
	})
});

socket.on('DANG_KY_THAT_BAI',() => alert('Vui long chon username khac!'));


function openStream(){

	const config = {audio: false, video: true};
	return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream){
	const video = document.getElementById(idVideoTag);
	video.srcObject = stream; // buoc nay neo cai stream vao srcObject cung video
	video.play();
}

openStream()
.then(stream => playStream('localStream',stream));

// var clientid = Math.random().toString(36).slice(2).slice(0, 6); ramdom peerID
var peer = new Peer({key: 'peerjs', host: 'frtwebrtc.herokuapp.com', port: 443, secure: true,});
peer.on('open', id => {
	$('#my-peer').append(id);
	$('#btnSignUp').click(() => {
		const username = $('#txtUsername').val();
		socket.emit('NGUOI_DUNG_DANG_KY',{ ten: username, peerID: id });
	});
});

//caller
$('#btnCall').click(()=> {
	const id = $('#remoteId').val();
	openStream()
	.then(stream => {
		playStream('localStream', stream);
		const call = peer.call(id, stream);
		call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
	});
});

//Callee
peer.on('call', call => {
	openStream()
	.then(stream => {
		call.answer(stream);
		playStream('localStream', stream);
		call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
	});
});

$('#uluser').on('click', 'li', function(){
	const id = $(this).attr('id');
	openStream()
	.then(stream => {
		playStream('localStream', stream);
		const call = peer.call(id, stream);
		call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
	});
});

