'use strict'

const OrderHook = exports = module.exports = {}

OrderHook.update = async (model) => {

    model.$sideLoaded.subtotal = await model.items().getSum('subtotal')
    model.$sideLoaded.qty_items = await model.items().getSum('quantity')

    model.total = model.$sideLoaded.subtotal
}

OrderHook.updateCollection = async models => {
    for(let model of models) {
        model = await OrderHook.update(model)
    }
}