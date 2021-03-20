import { Service } from "../src/service-decorator";
import { Injector } from "../src/injector";

@Service()
class Foo {
    doFooStuff() {
        console.log('foo');
    }
}
@Service()
class Bar {
    constructor(public foo: Foo) {
    }

    doBarStuff() {
        console.log('bar');
    }
}

@Service()
class Foobar {
    constructor(public foo: Foo, public bar: Bar) {
    }
}

const foobar = Injector.resolve<Foobar>(Foobar);
foobar.bar.doBarStuff();
foobar.foo.doFooStuff();
foobar.bar.foo.doFooStuff();