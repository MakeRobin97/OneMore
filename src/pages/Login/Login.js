import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import BASE_API from '../../config';

const Login = () => {
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  // VALIDATION CHECK
  const emailRegex =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  const pwRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
  const isEmailValid = emailRegex.test(userInfo.email);
  const isPwValid = pwRegex.test(userInfo.password);
  const isValidCheck = isEmailValid && isPwValid;

  const handleUserInfo = e => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };
  // KAKAO LOGIN
  const KAKAO_CLIENT_ID = process.env.REACT_APP_REST_API_KEY_KAKAO;
  const KAKAO_REDIRECT_URI = process.env.REACT_APP_REDIRECT_URL_KAKAO;
  const KAKAO_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

  const handleKakaoLogin = e => {
    window.location.href = KAKAO_URL;
  };

  // GOOGLE LOGIN
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_REST_API_KEY;
  const GOOGLE_REDIRECT_URI = process.env.REACT_APP_REDIRECT_URL;
  const GOOGLE_URL = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${GOOGLE_REDIRECT_URI}`;

  const handleGoogleLogin = e => {
    window.location.href = GOOGLE_URL;
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleLogin = e => {
    e.preventDefault();

    fetch(`${BASE_API}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userInfo.email,
        password: userInfo.password,
      }),
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error('communication failure');
      })
      .then(result => {
        if (result.message === 'LOGIN_SUCCESS') {
          localStorage.setItem('token', result.token);
          localStorage.setItem('nickname', result.nickname);
          navigate('/');
        } else if (result.status === 400) {
          alert('아이디, 비밀번호를 확인해주세요');
        } else {
          alert('로그인 실패');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <LoginWrap>
      <fieldset>
        <LoginLegend>login</LoginLegend>
        <LogoBox>{/* <img /> */}</LogoBox>
        <LoginInputWrap onChange={handleUserInfo}>
          <Input
            name="email"
            size="high"
            backgroundColor="#F5F6F8"
            placeholder="이메일을 입력해주세요"
          />
          <Input
            name="password"
            size="high"
            type="password"
            backgroundColor="#F5F6F8"
            placeholder="비밀번호를 입력해주세요"
          />
        </LoginInputWrap>
        <LoginButtonWrap>
          <Button type="submit" onClick={handleLogin} disabled={!isValidCheck}>
            로그인
          </Button>
          <Button
            type="submit"
            backgroundColor="white"
            color="green"
            onClick={handleSignUp}
          >
            회원가입
          </Button>
          <SocialButtonWrap>
            <Button type="button" onClick={handleKakaoLogin}>
              카카오로그인
            </Button>
            <Button type="button" onClick={handleGoogleLogin}>
              구글로그인
            </Button>
          </SocialButtonWrap>
        </LoginButtonWrap>
      </fieldset>
    </LoginWrap>
  );
};

const FLEX_COLUMN = `
display: flex;
align-items: center;
flex-direction: column;
gap: 5px;
`;

const LoginWrap = styled.form`
  height: 100%;
  border: 1px solid green;
  background-color: white;
  padding: 15px;
`;

const LoginLegend = styled.legend`
  visibility: hidden;
`;

const LogoBox = styled.div`
  height: 250px;
  margin: 0 50px;
  border: 1px solid gray;
`;

const LoginInputWrap = styled.div`
  ${FLEX_COLUMN}
  margin: 20px 0;
`;

const LoginButtonWrap = styled.div`
  ${FLEX_COLUMN}
  margin: 10px 0;
`;

const SocialButtonWrap = styled.div`
  display: flex;
`;

export default Login;
