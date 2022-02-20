import React, { useCallback } from "react";
import {
  Container,
  ModalContainer,
  CloseButton,
  TitleContainer,
  ContentContainer,
  ButtonContainer,
  SubmitButton,
  CancelButton,
} from "./styled";
import PropTypes from "prop-types";

function AlertModal({
  children,
  show,
  close,
  style,
  title,
  useOutside,
  useCloseButton,
  useSubmitButton,
  useCancelButton,
  submitButtonName,
  confirm,
}) {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }

  return (
    <Container onClick={useOutside ? close : null}>
      <ModalContainer onClick={stopPropagation} style={style}>
        {useCloseButton && <CloseButton onClick={close}>&times;</CloseButton>}
        {/*<TitleContainer>{title}sfssdf</TitleContainer>*/}
        <ContentContainer>
          {children}assssssssssssssdawasdlorem Lorem ipsum dolor sit amet,
          consectetur adipisicing elit. Corporis dignissimos, dolor eius fuga
          laborum laudantium libero maxime possimus veritatis voluptatem?
        </ContentContainer>
        <ButtonContainer>
          {useCancelButton && <CancelButton onClick={close}>취소</CancelButton>}
          {useSubmitButton && (
            <SubmitButton onClick={confirm}>{submitButtonName}</SubmitButton>
          )}
        </ButtonContainer>
      </ModalContainer>
    </Container>
  );
}

AlertModal.defaultProps = {
  useOutside: true,
  useCloseButton: true,
  useSubmitButton: true,
  useCancelButton: true,
  submitButtonName: "확인",
};

//PropTypes 적용안됌 추후 수정예정, 확인한 날짜 : 21-07-23
AlertModal.propTypes = {
  show: PropTypes.bool,
  close: PropTypes.func,
  style: PropTypes.any,
  title: PropTypes.string,
  useOutside: PropTypes.bool,
  useCloseButton: PropTypes.bool,
  useSubmitButton: PropTypes.bool,
  useCancelButton: PropTypes.bool,
  submitButtonName: PropTypes.string,
  confirm: PropTypes.func,
};

export default AlertModal;
