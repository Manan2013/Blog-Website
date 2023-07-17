export default function Post() {
    return (
        <div className="post">
          <div className="image">
            <img src="https://techcrunch.com/wp-content/uploads/2022/12/GettyImages-1409832353.jpg?w=730&crop=1" alt="" />
          </div>
          <div className="texts">
            <h2>Lorem ipsum dolor sit amet.</h2>
            <p className="info">
              <a className="author">Manan Purohit</a>
              <time>2023-07-16</time>
            </p>
            <p className="summary">Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, dolorum.</p>    
          </div>
        </div>
    );
}