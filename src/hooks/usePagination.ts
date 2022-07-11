import { useMemo } from "react";

const DOTS = "...";

const range = (start: number, end: number) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, i) => i + start);
};

export const usePagination = ({
  totalCount,
  PAGE_SIZE,
  currentPage,
  siblingCount = 1,
}: {
  totalCount: number;
  PAGE_SIZE: number;
  currentPage: number;
  siblingCount?: number;
}) => {
  const paginationRange = useMemo(() => {
    //Calculate number of pages
    const totalPageCount = Math.ceil(totalCount / PAGE_SIZE);
    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    if (PAGE_SIZE === 0) return null;

    //If number of pages is less that the page numbers, return range
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );
    /*
      We do not want to show dots if there is only one position left 
      after/before the left/right page count as that would lead to a change if our Pagination
      component size which we do not want
    */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [totalCount, PAGE_SIZE, siblingCount, currentPage]);

  return paginationRange;
};
