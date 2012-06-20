buster.testRunner.timeout = 1000;

buster.testCase('Basic Epitome empty collection creation >', {
    setUp: function() {
        this.Collection = new Class({
            Extends: Epitome.Collection,

            foo: function() {

            },

            onChange: function() {
                console.log('hai')
            }
        });

        this.collection = new this.Collection();
        this.model = new Epitome.Model({
            hello: 'there'
        });

    },

    tearDown: function() {
        this.collection.removeEvents('add');
        this.collection.removeEvents('remove');
    },

    'Expect a collection to be created >': function() {
        buster.assert.isTrue(instanceOf(this.collection, Epitome.Collection));
    },

    'Expect adding models to collection to fire onAdd event >': function() {
        var self = this;
        this.collection.addEvent('add', function(model) {
            buster.assert.equals(model, self.model);
        });

        this.collection.addModel(this.model);
    },

    'Expect not to be able to add the same model twice to the collection >': function() {
        this.collection.addModel(this.model);
        this.collection.addModel(this.model);
        buster.assert.equals(this.collection.length, 1);
    },

    'Expect adding a model with the same cid twice to fire an add:error event >': function() {
        var spy = this.spy();
        this.collection.addEvent('add:error', spy);
        this.collection.addModel(this.model);
        this.collection.addModel(this.model);
        buster.assert.calledWith(spy, this.model);
    },

    'Expect adding a model with the same cid with a replace flag to work >': function() {
        var spy = this.spy(),
            fakeModel = new Epitome.Model({
                id: 'hello'
            });

        this.model.set('id', 'hello');
        this.collection.addModel(this.model);
        this.collection.addEvent('add', spy);
        this.collection.addModel(fakeModel, true);
        buster.assert.calledWith(spy, fakeModel);
    },

    'Expect removing models to collection to fire onRemove event >': function() {
        var self = this;
        this.collection.addModel(this.model);
        this.collection.addEvent('remove', function(model) {
            buster.assert.equals(model, self.model);
        });
        this.collection.removeModel(this.model);
    },

    'Expect to be able to add models to the collection': function() {
        var models = this.collection._models.length;
        this.collection.addModel(this.model);
        buster.assert.equals(this.collection._models.length, models + 1);
    },

    'Expect to be able to remove models from the collection': function() {
        var modelsCount = this.collection._models.length;
        this.collection.addModel(this.model);
        this.collection.removeModel(this.model);
        buster.assert.equals(this.collection._models.length, modelsCount);
    }

});


buster.testCase('Basic Epitome collection with a model creation >', {
    setUp: function() {
        this.Collection = new Class({
            Extends: Epitome.Collection,

            options: {
                onChange: function() {
                    this.change.apply(this, arguments)
                }
            },

            change: function(model, key) {
                // console.log(model.cid, key, model.get(key));
            }
        });

        this.model = new Epitome.Model({
            hello: 'there'
        });

        this.models = [this.model];

        this.collection = new this.Collection(this.models);
    },

    tearDown: function() {
        this.collection.removeEvents('add');
        this.collection.removeEvents('remove');
    },

    'Expect models to be equal to number passed in constructor >': function() {
        buster.assert.equals(this.collection._models.length, this.models.length);
    },

    'Expect onChange on a model to fire for collection >': function() {
        var self = this;
        this.collection.addEvent('change', function(model, props) {
            buster.assert.equals(model, self.model);
        });
        this.model.set('foo', 'bar');
    },

    'Expect any Event on any model to fire for collection observer >': function() {
        var self = this,
            event = String.uniqueID();
        this.collection.addEvent(event, function(model) {
            buster.assert.equals(model, self.model);
        });
        this.model.fireEvent(event);
    },

    'Expect toJSON to return an array of all models\' dereferenced objects': function() {
        buster.assert.equals(this.collection.toJSON().length, this.collection.length);
    }


});