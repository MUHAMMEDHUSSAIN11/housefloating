const Aboutimage = () => {
  return (
    <div className="relative h-96 sm:h-120 md:h-144 lg:h-192 xl:h-240">
      {/* Background Image */}
      <img src="/images/BG-cr.jpg" alt="About background image" className="absolute inset-0 object-cover w-full h-full"/>
      <div className="absolute inset-0 bg-black/20 flex flex-col justify-center items-center">
      </div>
    </div>
  );
};

export default Aboutimage;
