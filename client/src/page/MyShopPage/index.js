import {
  Container,
  TabContent,
  TabMenu,
  EditProfileMenu,
  UserStore,
  UserStoreContents,
} from "./styled";
import React, { useEffect, useRef, useState } from "react";
import { Link, Route, Switch, withRouter } from "react-router-dom";
import { AiFillShop } from "react-icons/ai";
import { GrEdit } from "react-icons/gr";

import { useSelector } from "react-redux";
import ShopProductsPage from "./Section/ShopProductsPage";
import ShopCommentsPage from "./Section/ShopCommentsPage";
import ShopFavoritesPage from "./Section/ShopFavoritesPage";
import ShopReviewsPage from "./Section/ShopReviewsPage";
import ShopFollowingsPage from "./Section/ShopFollowingsPage";
import ShopFollowersPage from "./Section/ShopFollowersPage";
import axios from "axios";
import { oneDaysFormat } from "../../utils/Time";
import Menu from "../../components/Menu";
import AlertModal from "../../components/AlertModal";
import ImageCrop from "../../components/ImageCrop";

const MyShopPage = ({ history }) => {
  const tabMenuList = [
    "상품",
    "상품문의",
    "찜",
    "상점후기",
    "팔로잉",
    "팔로워",
  ];
  const [tabMenu, setTabMenu] = useState(0);
  const [tabMenuName, setTabMenuName] = useState("상품");

  const user = useSelector((state) => state.user);

  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");

  const [editStoreName, setEditStoreName] = useState(false);
  const [editStoreDescription, setEditStoreDescription] = useState(false);

  const [products, setProducts] = useState([]);

  const [showEditMenu, setShowEditMenu] = useState(false);

  const [showResetModal, setShowResetModal] = useState(false);
  const [showCropImageModal, setShowCropImageModal] = useState(false);

  const onCloseEditMenu = () => {
    setShowEditMenu(false);
  };

  const onClickTabMenu = (e) => {
    const tabIndex = e.target.value;
    setTabMenu(tabIndex);
    setTabMenuName(tabMenuList[parseInt(tabIndex)]);
  };

  const onChangeStoreName = (e) => {
    if (e.target.value.length < 16) setStoreName(e.target.value);
  };
  const onChangeStoreDescription = (e) => {
    if (e.target.value.length < 250) setStoreDescription(e.target.value);
  };

  // 응답 후 상태 업데이트
  function setResState() {
    history.push(`/shop/${user.isSignin.data._id}`);
  }

  useEffect(() => {
    axios
      .get("/user/detail")
      .then((res) => {
        console.log("res detail >> ", res);
        console.log("data >> ", res.data.data.products);
        setProducts(res.data.data.products);
      })
      .catch((err) => {
        console.log("err detail >> ", err);
      });
  }, []);

  // 상점명 변경
  const onSubmitStoreName = () => {
    // 변경할 상점명을 입력하지 않았을 때(공백 제거 후)
    if (storeName.trim() === "") return;

    // 변경할 상점명이 기존의 상점명과 동일할 때
    if (storeName === user.isSignin.data.storeName) {
      setEditStoreName(false);
      return;
    }

    axios
      .patch("/user/nickname", { storeName })
      .then((res) => {
        console.log("res >> ", res);

        // 상점명 변경 성공
        setEditStoreName(false);
        setResState(res);
      })
      .catch((err) => {
        console.log("err >> ", err);
      });
  };

  const onSubmitStoreDescription = () => {
    if (storeDescription === "") return;

    axios
      .patch("/user/description", { description: storeDescription })
      .then((res) => {
        console.log("res >> ", res);
        // 상점 소개글 변경 성공
        setResState(res);
        setEditStoreDescription(false);
      })
      .catch((err) => {
        console.log("err >> ", err);
      });
  };

  const resetProfileImage = () => {
    axios
      .patch("/user/profile/reset")
      .then((res) => {
        console.log("res >> ", res);

        // 프로필 이미지 초기화 성공
        if (res.data.success) {
          history.push(`/shop/${user.isSignin.data._id}`);
        }
      })
      .catch((err) => {
        console.log("err >> ", err);
      });
  };

  const onClickEditStoreName = () => {
    setStoreName(user.isSignin.data.storeName);
    setEditStoreName((prev) => !prev);
  };

  const onClickEditStoreDescription = () => {
    setStoreDescription(user.isSignin.data.description);
    setEditStoreDescription((prev) => !prev);
  };

  const onClickMyStoreManagement = () => {
    history.push("/product/manage");
  };

  return (
    <Container>
      <UserStore>
        <div className="imgWrapper">
          <div className="background_img_wrapper">
            <img
              className="background_img"
              src={`${user.isSignin.data.profileURL}`}
            />
            <Menu show={showEditMenu} close={onCloseEditMenu}>
              <EditProfileMenu>
                <ul>
                  <li onClick={() => setShowResetModal(true)}>
                    기본 이미지로 초기화
                  </li>
                  <li onClick={() => setShowCropImageModal(true)}>
                    프로필 이미지 변경
                  </li>
                </ul>
              </EditProfileMenu>
            </Menu>
          </div>
          <div className="background_img_cover"></div>
          <img
            className="profile_img"
            src={`${user.isSignin.data.profileURL}`}
          />
          <div className="store_name">
            {user.isSignin && user.isSignin.data.storeName}
          </div>
          <span
            className="edit_profile_img"
            onClick={() => setShowEditMenu((prev) => !prev)}
          >
            <GrEdit
              size={16}
              style={{ color: "#000000", marginRight: "4px" }}
            />
            수정
          </span>

          <div className="store_management" onClick={onClickMyStoreManagement}>
            내 상점 관리
          </div>
        </div>
        <UserStoreContents>
          <div className="contents_store_name">
            {!editStoreName ? (
              <>
                {user.isSignin && user.isSignin.data.storeName}&nbsp;&nbsp;
                <button onClick={onClickEditStoreName}>상점명 수정</button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={storeName}
                  onChange={onChangeStoreName}
                />
                <button
                  className="store_name_submit_btn"
                  onClick={onSubmitStoreName}
                >
                  확인
                </button>
              </>
            )}
          </div>
          <div className="badge">
            <span className="icon">
              <AiFillShop />
              &nbsp;&nbsp;
            </span>
            상점오픈일&nbsp;
            <span>{oneDaysFormat(user.isSignin.data.createdAt)}</span>
          </div>
          <div className="contents_store_desc">
            {!editStoreDescription ? (
              <>
                {user.isSignin &&
                  user.isSignin.data.description.split("\n").map((line) => (
                    <>
                      {line} <br />
                    </>
                  ))}
              </>
            ) : (
              <>
                <textarea
                  value={storeDescription}
                  onChange={onChangeStoreDescription}
                ></textarea>
                <button
                  className="store_desc_submit_btn"
                  onClick={onSubmitStoreDescription}
                >
                  확인
                </button>
              </>
            )}
          </div>
          {!editStoreDescription && (
            <button onClick={onClickEditStoreDescription}>소개글 수정</button>
          )}
        </UserStoreContents>
      </UserStore>
      <TabMenu>
        <ul>
          {tabMenuList &&
            tabMenuList.map((menu, index) => (
              <li
                className={tabMenu === index && "active"}
                onClick={onClickTabMenu}
                value={index}
              >
                {menu}
              </li>
            ))}
        </ul>
      </TabMenu>
      <TabContent>
        <h3>{tabMenuName}</h3>
        <hr />
        {tabMenu === 0 && <ShopProductsPage products={products} />}
        {tabMenu === 1 && <ShopCommentsPage />}
        {tabMenu === 2 && <ShopFavoritesPage />}
        {tabMenu === 3 && <ShopReviewsPage />}
        {tabMenu === 4 && <ShopFollowingsPage />}
        {tabMenu === 5 && <ShopFollowersPage />}
      </TabContent>
      <AlertModal
        useCloseButton={false}
        show={showResetModal}
        close={() => setShowResetModal(false)}
        confirm={resetProfileImage}
      >
        프로필 이미지를 초기화 하시겠습니까?
      </AlertModal>
      <ImageCrop
        show={showCropImageModal}
        close={() => setShowCropImageModal(false)}
      ></ImageCrop>
    </Container>
  );
};

export default withRouter(MyShopPage);
