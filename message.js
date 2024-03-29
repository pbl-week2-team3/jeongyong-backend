// 회원가입, 로그인 메시지
const emailFormError = "이메일 형식이 아닙니다.";
const nicknameLengthError = "닉네임은 알파벳과 숫자로만 구성된 3글자 이상이어야 합니다.";
const passwordLengthError = "비밀번호는 최소 4자 이상이어야 하고 닉네임이 포함될 수 없습니다.";

const isRegistedError = "이미 등록된 이메일이나 닉네임입니다.";
const isNotRegistedError = "등록되지 않은 사용자이거나 비밀번호가 틀렸습니다.";
const loggedinError = "이미 로그인한 사용자입니다.";

const isEmptyError = "빈 칸이 있습니다. 채워주세요.";
const confirmPasswordError = "입력하신 비밀번호가 비밀번호 확인란과 일치하지 않습니다.";


// 인증 메시지
const authError = "로그인이 필요한 서비스입니다.";


// 게시판 메시지
const isNotExistPostError = "존재하지 않는 게시글입니다.";
const isNotWriterError = "작성자만 수정 및 삭제할 수 있습니다.";
const isNotExistLikeError = "좋아요를 누른적이 없거나 잘못된 요청입니다.";
const existLikeError = "좋아요 중복 요청입니다.";


// 요청 성공
const success = "요청 성공";


module.exports = { 
    emailFormError,
    nicknameLengthError,
    passwordLengthError,
    isRegistedError,
    isNotRegistedError,
    loggedinError,
    isEmptyError, 
    confirmPasswordError,
    authError,
    isNotExistPostError,
    isNotWriterError,
    isNotExistLikeError,
    existLikeError,
    success,
}