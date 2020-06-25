import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";
import FeedbackController from "./FeedbackController.js";

export default class ReceiveDossierController extends ModalController {
    constructor(element, history) {
        super(element, history);

        this.feedbackController = new FeedbackController(this.model);
        this._initListeners();
    }

    _initListeners = () => {
        this.on('next-receive-dossier', this._continueReceiveProcess);
        this.on('finish-receive-dossier', this._finishReceiveDossierProcess);

        this.model.onChange("dossierNameInput.value", this._validateUserForm);
        this.model.onChange("destinationOptionsForDossier.value", this._validateUserForm);
    };

    _continueReceiveProcess = (event) => {
        event.stopImmediatePropagation();

        console.log('Indentity shared. Proceeding to the next step.');
        this.model.setChainValue('isDossierNameStep', true);
    }

    _finishReceiveDossierProcess = (event) => {
        event.stopImmediatePropagation();
        this.feedbackController.updateErrorMessage(null);

        let dossierName = this.model.dossierNameInput.value;
        let selectedDossierDestination = this.model.destinationOptionsForDossier.value;

        this.responseCallback(undefined, {
            success: true,
            dossierName: dossierName, // To be removed after integration
            selectedDossierDestination: selectedDossierDestination // To be removed after integration
                // Send back to main Explorer controller the respose that can close the modal 
                //and to fetch the new list items
        });
    }

    _validateUserForm = () => {
        this.feedbackController.updateErrorMessage(null);

        let isEmptyName = this.model.dossierNameInput.value.trim().length === 0;
        let isDestinationSelected = this.model.destinationOptionsForDossier.value.trim().length !== 0;
        if (!isDestinationSelected) {
            this.model.setChainValue('destinationOptionsForDossier.value', '/');
            isDestinationSelected = true;
        }

        let isFinishButtonDisabled = isEmptyName || !isDestinationSelected;
        this.model.setChainValue('buttons.finishButton.disabled', isFinishButtonDisabled);

        if (isEmptyName) {
            this.feedbackController.updateErrorMessage(this.model.error.errorLabels.nameNotEmptyLabel);
        }
    };
}