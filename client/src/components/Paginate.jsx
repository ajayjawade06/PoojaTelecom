import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '', category = '' }) => {
  return (
    pages > 1 && (
      <div className="flex items-center justify-center gap-2 mt-16">
        {[...Array(pages).keys()].map((x) => (
          <Link
            key={x + 1}
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${x + 1}`
                  : category
                  ? `/category/${category}/page/${x + 1}`
                  : `/page/${x + 1}`
                : `/admin/productlist/${x + 1}`
            }
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-all border ${
              x + 1 === page
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20 scale-110'
                : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-300 hover:text-emerald-500'
            }`}
          >
            {x + 1}
          </Link>
        ))}
      </div>
    )
  );
};

export default Paginate;
