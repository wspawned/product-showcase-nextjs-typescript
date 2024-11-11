const Button:React.FC<{disabled: boolean, onClick: () => void}> = ({disabled, onClick}) => {
  return(
    <div className="flex justify-center lg:justify-start items-center w-full my-4 lg:my-8">
        <button
        className={`bg-amber-400 text-white text-lg lg:text-2xl font-bold rounded p-6 w-[200px] lg:w-[300px] disabled:bg-gray-200 lg:ml-[200px]`}
        disabled={disabled}
        onClick={() => onClick()}
        >
          SEPETE EKLE
        </button>
      </div>
  )
};

export default Button;