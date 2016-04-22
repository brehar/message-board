'use strict';

var $msgToDelete;

$(document).ready(function() {
    $('.modal-trigger').leanModal();
    $('.add-message').click(addMessage);
    $('.messages').on('click', '.delete-btn', deleteMessage);
    $('.messages').on('click', '.edit-btn', editMessage);
    $('.edit-message').click(saveChanges);
});

function addMessage() {
    var message = {
        message: $('#message').val(),
        name: $('#name').val(),
        email: $('#email').val(),
        image: $('#image').val(),
        timestamp: moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a'),
        id: uuid()
    };

    $.ajax({
        url: '/api/messages',
        type: 'POST',
        data: message,
        success: function() {
            var $message = $('.hidden').clone();
            $message.removeClass('hidden');

            $message.find('img').attr('src', message.image);
            $message.find('a.email-field').attr('href', 'mailto:' + message.email);
            $message.find('a.email-field').text(message.name);
            $message.find('p.primary-content').text(message.message);
            $message.find('p.secondary-content').text(message.timestamp);
            $message.find('a.delete-btn').attr('data-id', message.id);
            $message.find('a.edit-btn').attr('data-id', message.id);

            $('.messages').prepend($message);

            $('#message').val('');
            $('#name').val('');
            $('#email').val('');
            $('#image').val('');

            $('.modal-trigger').leanModal('destroy');
        },
        error: function() {
            Materialize.toast('Unable to post message. Please ensure all fields are completed and try again later.', 4000);
        }
    });
}

function deleteMessage() {
    var id = $(this).attr('data-id');
    var $msg = $(this);

    $.ajax({
        url: '/api/messages/' + id,
        type: 'DELETE',
        success: function() {
            $msg.parent().parent().parent().remove();
        },
        error: function() {
            Materialize.toast('Unable to delete message.', 4000);
        }
    });
}

function editMessage() {
    var id = $(this).attr('data-id');
    $msgToDelete = $(this);

    $.ajax({
        url: '/api/messages/' + id,
        type: 'GET',
        success: function(data) {
            $('#edit-message').val(data.message);
            $('#edit-name').val(data.name);
            $('#edit-email').val(data.email);
            $('#edit-image').val(data.image);
            $('#edit-id').val(data.id);
        },
        error: function() {
            Materialize.toast('Unable to load message for editing.', 4000);
        }
    });
}

function saveChanges() {
    var message = {
        message: $('#edit-message').val(),
        name: $('#edit-name').val(),
        email: $('#edit-email').val(),
        image: $('#edit-image').val(),
        timestamp: 'Last Updated: ' + moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a'),
        id: $('#edit-id').val()
    };

    $msgToDelete.parent().parent().parent().remove();

    $.ajax({
        url: '/api/messages/' + message.id,
        type: 'PUT',
        data: message,
        success: function() {
            var $message = $('.hidden').clone();
            $message.removeClass('hidden');

            $message.find('img').attr('src', message.image);
            $message.find('a.email-field').attr('href', 'mailto:' + message.email);
            $message.find('a.email-field').text(message.name);
            $message.find('p.primary-content').text(message.message);
            $message.find('p.secondary-content').text(message.timestamp);
            $message.find('a.delete-btn').attr('data-id', message.id);
            $message.find('a.edit-btn').attr('data-id', message.id);

            $('.messages').prepend($message);

            $('#edit-message').val('');
            $('#edit-name').val('');
            $('#edit-email').val('');
            $('#edit-image').val('');
            $('#edit-id').val('');
        },
        error: function() {
            Materialize.toast('Unable to save changes.', 4000);
        }
    });
}