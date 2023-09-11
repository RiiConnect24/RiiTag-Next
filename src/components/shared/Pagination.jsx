import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';

function Pagination({ currentPage, totalPages, handlePageClick }) {
  return (
    <ReactPaginate
      containerClassName="pagination justify-content-center flex-wrap"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      activeClassName="active"
      disabledLinkClassName="disabled"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      breakLabel="..."
      nextLabel="Next >"
      forcePage={currentPage}
      onPageChange={handlePageClick}
      pageRangeDisplayed={5}
      pageCount={totalPages}
      previousLabel="< Previous"
      renderOnZeroPageCount={null}
    />
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handlePageClick: PropTypes.func.isRequired,
};

export default Pagination;
