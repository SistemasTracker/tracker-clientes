import React from 'react'

const Pagination = ({postPerPage, totalPosts, paginate, maxNumberLimit, minNumberLimit }) => {

  const pageNumbers = [];
  for(let i = 1; i <= Math.ceil(totalPosts/ postPerPage); i++){
    pageNumbers.push(i);
  }

  /*  <ul className='pagination'>
                {pageNumbers.map(number => { if (number < maxNumberLimit + 1 && number > minNumberLimit) {
                    return (
                      <li key={number} className='page-item'>
                          <button onClick={() => paginate(number)}className='page-link'>{number}</button>              
                      </li>
                    )
                } else {
                  return null;
                }  
                })}
  */              
 
  return (
    <nav>
            <ul className='pagination'>
                {pageNumbers.map(number => { 
                    return (
                      <li key={number} className='page-item'>
                          <button onClick={() => paginate(number)}className='page-link'>{number}</button>              
                      </li>
                    )
                })}

            </ul>
    </nav>
   
  )
}

export default Pagination