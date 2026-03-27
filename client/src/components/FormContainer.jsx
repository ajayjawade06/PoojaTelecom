const FormContainer = ({ children }) => {
  return (
    <div className="container mx-auto px-4 mt-8">
      <div className="flex justify-center">
        <div className="w-full md:w-1/2 lg:w-1/3 shadow-md hover:shadow-lg transition-shadow bg-white rounded-lg p-6 border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
};
export default FormContainer;
