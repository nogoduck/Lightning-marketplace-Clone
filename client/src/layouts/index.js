import { Route, Switch, withRouter, useLocation } from "react-router-dom";
import React from "react";
import { Container } from "./styled";
import TopNav from "./Header/TopNav";
import SearchNav from "./Header/SearchNav";
import ProductNewPage from "../page/ProductNewPage";
import MyShopPage from "../page/MyShopPage";
import TalkPage from "../page/TalkPage";
import Footer from "./Footer";
import CertificationPage from "../page/OAuthPage";

function MainPage({ history }) {
  const { pathname } = useLocation();

  if (pathname === "/oauth") {
    return (
      <>
        <Route exact path="/oauth" component={CertificationPage} />
      </>
    );
  } else {
    return (
      <Container>
        <Switch></Switch>

        <TopNav></TopNav>
        <SearchNav></SearchNav>
        <Switch>
          <Route path="/product/new" component={ProductNewPage} />
          <Route path="/shop" component={MyShopPage} />
          <Route path="/talk" component={TalkPage} />
        </Switch>
        <Footer></Footer>
      </Container>
    );
  }
}

export default withRouter(MainPage);
