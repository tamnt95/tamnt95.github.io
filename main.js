const socket = io('https://mypeer3000.herokuapp.com/');

$('#div-chat').hide();

let customConfig;

$.ajax({
	url: "https://service.xirsys.com/ice",
	data: {
		ident: "poseidon12495",
		secret: "c7f82d3e-5d8c-11e8-8e2a-6011996e9463",
		domain: "tamnt95.github.io",
		application: "default",
		room: "default",
		secure: 1
	},
	success: function (data, status){
		customConfig = data.d;
		console.log(customConfig);
	},
	async: false
});

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
	const config = {audio: true, video: true};
	return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream){
	const video = document.getElementById(idVideoTag);
	video.srcObject = stream; // buoc nay neo cai stream vao srcObject cung video
	video.play();
}

openStream()
.then(stream => playStream('localStream',stream));

// var clientid = Math.random().toString(36).slice(2).slice(0, 6);
var peer = new Peer({
	key: 'peerjs',
	host: 'frtwebrtc.herokuapp.com', 
	port: 443, 
	secure: true, 
	config: customConfig
});
// const peer = new Peer({ key: 'tkv5g2acaree9udi'});
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

