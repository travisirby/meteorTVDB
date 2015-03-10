Template.modal.events({
  'click button.modal': function(event, template) {
    console.log("active modal 2")
    var name = template.$(event.target).data('modal-template');
    Session.set('activeModal', name);
  }
});

Template.modal.helpers({
  activeModal: function() {
    console.log("active modal");
    return Session.get('activeModal');
  }
});
