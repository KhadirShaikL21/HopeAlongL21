const Button = ({ children, onClick, disabled, variant = "primary", className = "" }) => {
  const baseClasses =
    "w-full flex justify-center items-center gap-2 py-2 px-4 rounded-xl font-semibold transition h-11 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    google:
      "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400 shadow-sm",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;