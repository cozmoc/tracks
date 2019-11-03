import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';

function AreYouSureModal(props) {
	const [open, setOpen] = React.useState(false);

	function handleClickOpen() {
		setOpen(true);
	}

	function handleClose() {
		setOpen(false);
	}

	function submit() {
		props.onAccept();
		handleClose();
	}

	return (
		<div>
			<IconButton onClick={handleClickOpen}>
				{props.icon}
			</IconButton>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{"Delete this Track?"}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Are you sure?
          			</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={submit} color="primary" autoFocus>
						Yes
          			</Button>
					<Button onClick={handleClose} color="primary">
						No
          			</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default AreYouSureModal;