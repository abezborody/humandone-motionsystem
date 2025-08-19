import { CSSEasing } from "./components/CSSEasing";
import { Header } from "./components/header";
import { CSS_EASINGS } from "./lib/css-easings";

function App() {
  return (
    <div className="container mx-auto">
      <Header />
      <div className="flex flex-col gap-4 my-12">
        <h1 className="text-3xl font-bold">Motion System</h1>
        <p className="font-base max-w-2/3 lg:max-w-2/3 md:max-w-full sm:max-w-full">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem labore
          nostrum natus facilis, sapiente recusandae laudantium quidem deleniti
          dignissimos iusto veritatis, et doloremque! Nam id nesciunt est, earum
          obcaecati laudantium.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">CSS easings</h2>
        <div className="grid grid-cols-4 gap-4">
          {CSS_EASINGS.map((item) => (
            <CSSEasing easing={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
