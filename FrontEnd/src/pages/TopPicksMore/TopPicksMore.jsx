import React from 'react'
import "./TopPicksMore.css"
import TopPicksMoreFilter from '../../components/TopPicksMoreFilter/TopPicksMoreFilter'
import TopPicksMoreCards from '../../components/TopPicksMoreCards/TopPicksMoreCards'

function TopPicksMore() {
  return (
    <div className="container">
       <div className="subContainerTopPicksMore">
        <div className="categoryFilterTopPicksMore">
          <TopPicksMoreFilter/>
        </div>
        <div className="categoryProductsTopPicksMore">
          <TopPicksMoreCards/>
          </div>
      </div> 
    </div>
  )
}

export default TopPicksMore