API List

--------------------------------------------------------------------
// 회원 관리 관련 API

// 기능 : 회원 가입 요청
// 내용 : 회원 가입을 요청한다. password는 sha256알고리즘으로 단방향 해쉬값으로 DB에 들어간다.
- URL       : '/api/register'
- example   : 'http://xpecter.shop/api/register'
- Method    : POST
- Params    : None
- Body example
            {
                'id' : STRING,                  // email 형식
                'nickname' : STRING,            // 닉네임         
                'password' : STRING,            // 비밀번호
                'confirmPassword' : STRING,     // 비밀번호 확인
                'profile_img_url' : STRING      // 프로필 url
            }
- Response example
            status 201           // 요청 성공
            { success : true, messages : "" }

            status 400          // 요청 실패
            { 
                success : false, 
                messages : 
                    "이메일 형식이 아닙니다." 또는
                    "이미 등록된 이메일이나 닉네임입니다." 또는
                    "닉네임은 알파벳과 숫자로만 구성된 3글자 이상이어야 합니다." 또는
                    "빈 칸이 있습니다. 채워주세요." 또는
                    "비밀번호는 최소 4자 이상이어야 하고 닉네임이 포함될 수 없습니다.
            }


// 기능 : 로그인 요청
// 내용 : 로그인을 요청한다.
- URL       : '/api/login'
- example   : 'http://xpecter.shop/api/login'
- Method    : POST
- Params    : None
- Body example
            {
                'id' : STRING,                  // email 형식
                'password' : STRING,            // 암호
            }
- Response example
            status 201           // 요청 성공
            { success : true, messages : "" }
            cookie
            { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6IlhQRUNURVIiLCJpYXQiOjE2NDU0OTcyNjh9.pe4UGYXzxxkwhDs8swoqPa4iJJD730u0htVpfQS4YAc", tokenType: "Bearer"}

            status 400          // 요청 실패
            { 
                success : false, 
                messages : 
                    "이메일 형식이 아닙니다." 또는
                    "빈 칸이 있습니다. 채워주세요." 또는 
                    "등록되지 않은 사용자이거나 비밀번호가 틀렸습니다."
            }


// 기능 : 자기 정보 요청
// 내용 : 로그인 유지상태를 확인하기 위해 요청한다.
- URL       : '/api/me'
- example   : 'http://xpecter.shop/api/me'
- Method    : POST
- Params    
            headers
            {
                token : 토큰 값
            }
- Body example
            {
                'id' : STRING,                  // email 형식
                'password' : STRING,            // 암호
            }
- Response example
            status 201           // 요청 성공
            { nickname : "닉네임", profile_img_url : "asdfasdf.png" }

            status 400          // 요청 실패
            { 
                success : false, 
                messages : 
                    "로그인이 필요한 서비스입니다."
            }

--------------------------------------------------------------------
// 게시글 관련 API

// 기능 : 게시글 목록 조회
// 내용 : 전체 게시글의 내용을 가져온다
- URL       : '/api/post'
- example   : 'http://xpecter.shop/api/post'
- Method    : GET
- Params    : None
- Body      
            // 헤더에 토큰이 있으면 like_check를 한 값을 보낸다.
            headers
            {
                token : 토큰 값
            }
- Response example
            status 200
            {
                post : [
                    {
                        id : 1,
                        nickname : "kjy",
                        contents : "게시글 내용",
                        profile_img : "~~~~.png",
                        like_count : 15,
                        like_check : "true",
                        reg_date : "2022-02-21 05:49:58"
                    }
                    {
                        id : 2,
                        nickname : "...",
                        ......
                    }
                ]
            }


// 기능 : 특정 게시글 조회
// 내용 : 특정 게시물의 내용을 가져온다.
- URL       : '/api/post/:postId'
- example   : 'http://xpecter.shop/api/post/7'
- Method    : GET
- Params    : 게시글 번호(auto-increment 값, 전체 조회 때 번호를 알 수 있다.)
- Body      : None
- Response example
            status 200
            {
                {
                    id : 7,
                    nickname : "공정용",
                    contents : "게시글7 내용",
                    profile_img : "~~~~.png",
                    like_count : 20,
                    like_check : "false",
                    reg_date : "2022-02-21 05:49:58"
                }
            }


// 기능 : 게시글 작성 요청
// 내용 : 글 제목, 내용, 작성자만 보내면 DB에 넣는다. 쿠키로 토큰을 보내 인증을 거쳐야 한다.
- URL       : '/api/post'
- example   : 'http://xpecter.shop/api/post
- Method    : POST
- Params    : 토큰이 포함된 쿠키
- Body      
            { 
                'user_id' : String,         // 작성자 닉네임
                'contents' : String,        // 글 내용
                'img_url' : String          // 첨부 사진 Url
            }
- Response example
            성공시 status 201
            { success : true }


// 기능 : 게시글 수정 요청
// 내용 : 수정된 글 제목과 글 내용만 받는다. 쿠키로 토큰을 보내 인증을 거쳐야 한다.
- URL       : '/api/post/:postId'
- example   : 'http://xpecter.shop/api/post/7'
- Method    : PUT
- Params    : 게시글 번호(auto-increment 값, 전체 조회 때 번호를 알 수 있다.)
              토큰이 포함된 쿠키
- Body example
            {
                'contents' : String,        // 글 내용
                'img_url' : String          // 첨부 사진 Url
            }
- Response example
            status 200
            {
                {
                    id : 7,
                    nickname : "공정용",
                    contents : "게시글7 내용",
                    profile_img : "~~~~.png",
                    like_count : 20,
                    like_check : "false",
                    reg_date : "2022-02-21 05:49:58"
                }
            }
            
            status 400
            { 
                success : false, 
                messages : 
                    "존재하지 않는 게시글입니다." 또는
                    "작성자만 수정 및 삭제할 수 있습니다." 
            }


// 기능 : 게시글 삭제 요청
// 내용 : 게시글 id로 삭제를 요청한다. 
- URL       : '/api/articles/:articleId'
- example   : 'http://xpecter.shop/api/post/7'
- Method    : DELETE
- Params    : 게시글 번호(auto-increment 값, 전체 조회 때 번호를 알 수 있다.)
              토큰이 포함된 쿠키
- Body      : None
- Response example
            status 200
            { success : true, messages : "" }
            
            status 400
            { 
                success : false, 
                messages : 
                    "존재하지 않는 게시글입니다." 또는
                    "작성자만 수정 및 삭제할 수 있습니다." 
            }
            

--------------------------------------------------------------------
// 좋아요 관련 API


// 기능 : 게시글 좋아요 요청
// 내용 : 특정 게시글의 좋아요를 누르면 호출된다.  
- URL       : '/api/post/:postId/like'
- example   : 'http://xpecter.shop/api/post/7/like'
- Method    : POST
- Params    : 게시글 번호(auto-increment 값, 전체 조회 때 번호를 알 수 있다.)
              토큰이 포함된 쿠키
- Body      : None
- Response example
            status 200
            { success : true, messages : "" }
            
            status 400
            { 
                success : false, 
                messages : 
                    "존재하지 않는 게시글입니다." 또는
                    "좋아요 중복 요청입니다." 
            }


// 기능 : 게시글 좋아요 취소 요청
// 내용 : 특정 게시글의 좋아요를 한 상태에서 한 번 더 누르면 호출한다. likes 테이블에서 레코드를 삭제한다.
- URL       : '/api/post/:postId/like'
- example   : 'http://xpecter.shop/api/post/7/like'
- Method    : DELETE
- Params    : 게시글 번호(auto-increment 값, 전체 조회 때 번호를 알 수 있다.)
              토큰이 포함된 쿠키
- Body      : None
- Response example
            status 200
            { success : true, messages : "" }
            
            status 400
            { 
                success : false, 
                messages : 
                    "존재하지 않는 게시글입니다." 또는
                    "좋아요를 누른적이 없거나 잘못된 요청입니다." 
            }