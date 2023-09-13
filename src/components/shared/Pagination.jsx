import React from 'react'
import PropTypes from 'prop-types'
import ReactPaginate from 'react-paginate'
import LanguageContext from './LanguageContext'

function Pagination ({ currentPage, totalPages, handlePageClick }) {
  return (
    <LanguageContext.Helper.Consumer>
      {(lang) => (
        <ReactPaginate
          containerClassName='pagination justify-content-center flex-wrap'
          breakClassName='page-item'
          breakLinkClassName='page-link'
          pageClassName='page-item'
          pageLinkClassName='page-link'
          activeClassName='active'
          disabledLinkClassName='disabled'
          previousClassName='page-item'
          previousLinkClassName='page-link'
          nextClassName='page-item'
          nextLinkClassName='page-link'
          breakLabel='...'
          nextLabel={LanguageContext.languages[lang].next}
          forcePage={currentPage}
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPages}
          previousLabel={LanguageContext.languages[lang].previous}
          renderOnZeroPageCount={null}
        />
      )}
    </LanguageContext.Helper.Consumer>
  )
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handlePageClick: PropTypes.func.isRequired
}

export default Pagination
