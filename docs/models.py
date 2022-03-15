from django.db import models


class Doc(models.Model):
    document_file = models.FileField(upload_to='Documents/')

    def __str__(self):
        return str(self.pk)
