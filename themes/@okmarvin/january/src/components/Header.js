import React from 'react'
import PropTypes from 'prop-types'
import Menu from './Menu'
import { maxWidth, bps } from '../constants'
import { Link } from '@reach/router'
import { Col, Row, Inline } from 'jsxstyle'
const Header = props => (
  <Col
    flexShrink={0}
    alignItems='center'
    justifyContent='center'
    background='#fafafa'
    mediaQueries={bps}
    smFlexDirection='row'
    smBoxShadow='0 2px 0 0 #f2f2f2'
    smJustifyContent='space-between'
    smPaddingLeft={`calc((100% - ${maxWidth}) / 2)`}
    smPaddingRight={`calc((100% - ${maxWidth}) / 2)`}
    smBackground='#ffd54f'
  >
    <Row
      display='inline-flex'
      props={{ to: '/' }}
      component={Link}
      alignItems='center'
      color='#4a4a4a'
      fontSize='1.618em'
      lineHeight='2.625em'
      textDecoration='none'
      linkColor='#4a4a4a'
    >
      {props.logo && (
        <>
          <Inline
            component='img'
            height={42}
            fontSize={14}
            border='none'
            marginRight={10}
            props={{ src: props.logo, alt: 'logo' }}
          />
        </>
      )}
      {props.siteTitle}
    </Row>
    <Menu menu={props.menu} currentUrl={props.currentUrl} />
  </Col>
)
export default Header
Header.propTypes = {
  siteTitle: PropTypes.string.isRequired,
  logo: PropTypes.string,
  menu: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      permalink: PropTypes.string.isRequired
    })
  ),
  currentUrl: PropTypes.string.isRequired
}
Header.defaultProps = {
  menu: [],
  currentUrl: ''
}
