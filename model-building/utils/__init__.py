import tensorflow as tf

from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

from tensorflow.keras import layers

NUM_WORDS = 1000000
MAX_LEN = 140
NUM_CLASSES = 404


def tokenize_and_sequence(
    train_sentences, 
    test_sentences, 
    num_words=NUM_WORDS, 
    maxlen=MAX_LEN
    ):
    print(f"num_words: {num_words}")
    tok = Tokenizer(num_words=num_words, oov_token='<OOV>')
    tok.fit_on_texts(train_sentences)
    
    train_sequences = tok.texts_to_sequences(train_sentences)
    train_sequences = pad_sequences(
        train_sequences, 
        padding='post', maxlen=maxlen, truncating='post'
    )
    
    test_sequences = tok.texts_to_sequences(test_sentences)
    test_sequences = pad_sequences(
        test_sequences,
        padding='post', maxlen=maxlen, truncating='post'
    )
    
    return train_sequences, test_sequences, tok


class LangoModel(tf.keras.Model):
    def __init__(self, vocab_dim=NUM_WORDS, max_len=MAX_LEN, num_classes=NUM_CLASSES):
        super(LangoModel, self).__init__()
        self.embedding = layers.Embedding(vocab_dim, 32, input_length=max_len)
        self.lstm1 = layers.Bidirectional(layers.LSTM(32, return_sequences=True))
        self.lstm2 = layers.Bidirectional(layers.LSTM(16))
        self.dense = layers.Dense(64, activation='relu')
        self.dropout = layers.Dropout(0.5)
        self.classifier = layers.Dense(num_classes, activation='softmax')
    
    def call(self, inputs, training=False):
        x = self.embedding(inputs)
        x = self.lstm1(x)
        x = self.lstm2(x)
        x = self.dense(x)
        if training:
            x = self.dropout(x, training=training)
        return self.classifier(x)


if __name__ == '__main__':
    model = LangoModel()