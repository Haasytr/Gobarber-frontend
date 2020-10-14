import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  height: 100vh;


  > header{
    height: 144px;
    background: #28262e;

    display: flex;
      align-items: center;

    div{
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;



      svg{
        color: #999591;
        width: 24px;
        height: 24px;
      }
    }


  }
`;
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: -140px 0 auto;

  width: 100%;

  form {
    width: 340px;
    text-align: center;
    display: flex;
    flex-direction: column;

    h1 {
      margin-bottom: 24px;
      font-size: 20px;
      text-align: left;
    }

    button {
      margin-top: 10px;
    }
  }
`;

export const appearFromLeft = keyframes`
  from{
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

export const AvatarInput = styled.div`
  position: relative;
  width: 186px;
  align-self: center;
  img{
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }

  label {
    position: absolute;
    height: 48px;
    width: 48px;
    border-radius: 50%;
    right: 0%;
    background: #ff9000;
    border: 0;
    bottom: 0%;

    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    input {
      display: none;
    }

    svg {
      width: 20px;
      height: 20px;
      transition: 0.2s;
      color: #282636;
    }

    &:hover {
      background: ${shade(0.2, '#ff9000')}
    }
  }
`

export const ProfileInfo = styled.div`
  margin-bottom: 24px;
`

